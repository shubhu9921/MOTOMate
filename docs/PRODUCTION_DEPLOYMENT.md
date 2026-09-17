# MotorMate Production Deployment Guide

## Prerequisites
- **Server:** Ubuntu 22.04 LTS (Minimum 2GB RAM, 2 vCPUs)
- **Domain:** A pointed domain (e.g., `motormate.in`) for API and Frontend.
- **Database:** MySQL 8.0 server (Internal IP or localhost preferred).
- **Tools:** Node.js 18+, Java 17+, Maven, Nginx, PM2, Certbot (Let's Encrypt).

## 1. Environment Variables Configuration

Do not commit these values to version control. Set them on the server environment or use a `.env` loader.

### Backend (`/etc/motormate/backend.env` example):
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=motormate_prod
DB_USERNAME=PLACEHOLDER_REQUIRED
DB_PASSWORD=PLACEHOLDER_REQUIRED
JWT_SECRET=PLACEHOLDER_REQUIRED (Use a strong 64-character random string)
CORS_ORIGINS=https://motormate.in
LOGIN_RATE_LIMIT=10
WHATSAPP_VERIFY_TOKEN=PLACEHOLDER_REQUIRED
WHATSAPP_ACCESS_TOKEN=PLACEHOLDER_REQUIRED
WHATSAPP_PHONE_NUMBER_ID=PLACEHOLDER_REQUIRED
```

### Frontend (`.env.production`):
```env
VITE_API_BASE_URL=https://api.motormate.in/api
```

## 2. Database Setup & Backups

1. Log in to MySQL and create the database securely:
   ```sql
   CREATE DATABASE motormate_prod;
   CREATE USER 'motormate_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
   GRANT ALL PRIVILEGES ON motormate_prod.* TO 'motormate_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Automated Backups:**
   Create a script `/opt/scripts/backup_db.sh`:
   ```bash
   #!/bin/bash
   DATE=$(date +%Y-%m-%d_%H-%M-%S)
   mysqldump -u motormate_user -p'STRONG_PASSWORD' motormate_prod > /var/backups/motormate/db_$DATE.sql
   find /var/backups/motormate -type f -name "*.sql" -mtime +30 -exec rm {} \;
   ```
   Add to cron: `0 2 * * * /opt/scripts/backup_db.sh`

## 3. Deployment Steps

### Backend
1. Build the jar: `mvn clean package -DskipTests`
2. Create a systemd service `/etc/systemd/system/motormate-backend.service`:
   ```ini
   [Unit]
   Description=MotorMate Spring Boot Application
   After=network.target

   [Service]
   User=motormate
   EnvironmentFile=/etc/motormate/backend.env
   ExecStart=/usr/bin/java -jar /var/www/motormate/backend/backend-0.0.1-SNAPSHOT.jar --spring.config.location=classpath:/application-prod.properties
   SuccessExitStatus=143

   [Install]
   WantedBy=multi-user.target
   ```
3. Start the service: `sudo systemctl enable --now motormate-backend`

### Frontend
1. Build the react app: `npm install && npm run build`
2. Copy `dist` folder to `/var/www/motormate/frontend`.

## 4. Nginx Reverse Proxy & HTTPS

Install Nginx and Certbot:
```bash
sudo apt install nginx certbot python3-certbot-nginx
```

Configure Nginx (`/etc/nginx/sites-available/motormate`):
```nginx
server {
    server_name motormate.in;

    root /var/www/motormate/frontend;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}

server {
    server_name api.motormate.in;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Run `sudo certbot --nginx -d motormate.in -d api.motormate.in` to enable HTTPS.

## 5. Security & Firewall
Enable UFW and allow only HTTP/HTTPS and SSH. MySQL should remain completely internal.
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 6. WhatsApp Configuration
1. Go to the Meta Developer Portal.
2. Set Webhook URL to `https://api.motormate.in/api/webhooks/whatsapp`.
3. Provide the Verify Token matching `WHATSAPP_VERIFY_TOKEN`.
4. Subscribe to the `messages` topic.
