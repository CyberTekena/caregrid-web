console.log('📄 SQL Script for Manual Execution in Supabase Dashboard:')
console.log('='.repeat(60))
console.log('-- Run this script in your Supabase SQL Editor')
console.log('-- Go to: Supabase Dashboard > SQL Editor > New Query')
console.log('')

console.log('-- STEP 1: Create Auth Users Manually')
console.log('-- Go to: Authentication > Users and create these users:')
console.log('')

const users = [
  '1. Email: john.doe@student.babcock.edu.ng, Password: password123',
  '2. Email: jane.smith@student.babcock.edu.ng, Password: password123',
  '3. Email: mike.johnson@student.babcock.edu.ng, Password: password123',
  '4. Email: sarah.williams@cubicle.babcock.edu.ng, Password: password123',
  '5. Email: david.brown@cubicle.babcock.edu.ng, Password: password123',
  '6. Email: admin@babcock.edu.ng, Password: admin123'
]

users.forEach(user => console.log(user))

console.log('')
console.log('-- STEP 2: After creating users, run this SQL to create profiles:')
console.log('')

const profilesSQL = `
INSERT INTO profiles (id, email, role, matric_number, full_name, hall_id, room_number, blood_group, genotype, allergies, conditions) VALUES
((SELECT id FROM auth.users WHERE email = 'john.doe@student.babcock.edu.ng'), 'john.doe@student.babcock.edu.ng', 'student', '22/1234', 'John Doe', 'welch', 'A101', 'O+', 'AA', ARRAY['Peanuts'], ARRAY['Asthma']),
((SELECT id FROM auth.users WHERE email = 'jane.smith@student.babcock.edu.ng'), 'jane.smith@student.babcock.edu.ng', 'student', '22/1235', 'Jane Smith', 'neal-wilson', 'B202', 'A+', 'AS', ARRAY[]::text[], ARRAY[]::text[]),
((SELECT id FROM auth.users WHERE email = 'mike.johnson@student.babcock.edu.ng'), 'mike.johnson@student.babcock.edu.ng', 'student', '22/1236', 'Mike Johnson', 'nelson-mandela', 'C303', 'B+', 'AA', ARRAY['Shellfish'], ARRAY['Diabetes']);

INSERT INTO profiles (id, email, role, full_name, hall_id) VALUES
((SELECT id FROM auth.users WHERE email = 'sarah.williams@cubicle.babcock.edu.ng'), 'sarah.williams@cubicle.babcock.edu.ng', 'cubicle', 'Sarah Williams', 'welch'),
((SELECT id FROM auth.users WHERE email = 'david.brown@cubicle.babcock.edu.ng'), 'david.brown@cubicle.babcock.edu.ng', 'cubicle', 'David Brown', 'neal-wilson');

INSERT INTO profiles (id, email, role, full_name) VALUES
((SELECT id FROM auth.users WHERE email = 'admin@babcock.edu.ng'), 'admin@babcock.edu.ng', 'admin', 'System Administrator');
`

console.log(profilesSQL)

console.log('')
console.log('-- STEP 3: Add sample incidents and medications (optional)')
console.log('')

const sampleDataSQL = `
-- Sample incidents
INSERT INTO incidents (student_id, student_name, hall_id, room_number, type, description, status, latitude, longitude) VALUES
((SELECT id FROM auth.users WHERE email = 'john.doe@student.babcock.edu.ng'), 'John Doe', 'welch', 'A101', 'Medical Emergency', 'Difficulty breathing', 'pending', 6.8933, 3.7181),
((SELECT id FROM auth.users WHERE email = 'jane.smith@student.babcock.edu.ng'), 'Jane Smith', 'neal-wilson', 'B202', 'General Emergency', 'Fainted in room', 'resolved', 6.8935, 3.7183);

-- Sample medications
INSERT INTO medications (student_id, name, dosage, schedule_time, status) VALUES
((SELECT id FROM auth.users WHERE email = 'john.doe@student.babcock.edu.ng'), 'Albuterol Inhaler', '2 puffs every 4-6 hours', '08:00,14:00,20:00', 'active'),
((SELECT id FROM auth.users WHERE email = 'mike.johnson@student.babcock.edu.ng'), 'Metformin', '500mg twice daily', '08:00,20:00', 'active');
`

console.log(sampleDataSQL)

console.log('')
console.log('📋 Demo Accounts Summary:')
console.log('Students:')
console.log('  john.doe@student.babcock.edu.ng - password123 (John Doe)')
console.log('  jane.smith@student.babcock.edu.ng - password123 (Jane Smith)')
console.log('  mike.johnson@student.babcock.edu.ng - password123 (Mike Johnson)')
console.log('Cubicle Staff:')
console.log('  sarah.williams@cubicle.babcock.edu.ng - password123 (Sarah Williams)')
console.log('  david.brown@cubicle.babcock.edu.ng - password123 (David Brown)')
console.log('Admin:')
console.log('  admin@babcock.edu.ng - admin123 (System Administrator)')