INSERT INTO services (id, name, description, price, duration_minutes, active, category, service_type, vehicle_type_applicability, features, display_order, premium_flag, created_at, updated_at) VALUES 
(1, 'Base Wash', 'Exterior wash and dry, tire dressing, interior vacuum.', 499.00, 45, true, 'WASH', 'EXTERIOR', 'ALL', 'Exterior Wash, Tire Dressing, Interior Vacuum', 1, false, NOW(), NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO services (id, name, description, price, duration_minutes, active, category, service_type, vehicle_type_applicability, features, display_order, premium_flag, created_at, updated_at) VALUES 
(2, 'Medium Care', 'Base Wash + hand wax, dashboard wipe-down, window cleaning.', 999.00, 90, true, 'WASH', 'FULL', 'ALL', 'Base Wash, Hand Wax, Dashboard Wipe, Window Cleaning', 2, false, NOW(), NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO services (id, name, description, price, duration_minutes, active, category, service_type, vehicle_type_applicability, features, display_order, premium_flag, created_at, updated_at) VALUES 
(3, 'Premium Detail', 'Medium Care + clay bar treatment, deep interior shampoo, leather conditioning.', 1999.00, 180, true, 'DETAIL', 'FULL', 'ALL', 'Medium Care, Clay Bar, Interior Shampoo, Leather Conditioning', 3, true, NOW(), NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name);
