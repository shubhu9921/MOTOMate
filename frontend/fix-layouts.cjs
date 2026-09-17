const fs = require('fs');
const path = require('path');

const customerDir = path.join(__dirname, 'src/pages/customer');
const files = fs.readdirSync(customerDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(customerDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('CustomerLayout')) {
    // Remove import
    content = content.replace(/import CustomerLayout from '.*?';\n/, '');
    // Replace <CustomerLayout> with <>
    content = content.replace(/<CustomerLayout>/g, '<>');
    // Replace </CustomerLayout> with </>
    content = content.replace(/<\/CustomerLayout>/g, '</>');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
});
