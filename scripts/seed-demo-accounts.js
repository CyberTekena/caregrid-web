import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
const envPath = join(__dirname, '../../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars: Record<string, string> = {}

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Sample data for different user roles
const sampleUsers = {
  students: [
    {
      email: 'john.doe@student.babcock.edu.ng',
      password: 'password123',
      matricNumber: '22/1234',
      fullName: 'John Doe',
      hallId: 'welch',
      roomNumber: 'A101',
      bloodGroup: 'O+',
      genotype: 'AA',
      allergies: ['Peanuts'],
      conditions: ['Asthma']
    },
    {
      email: 'jane.smith@student.babcock.edu.ng',
      password: 'password123',
      matricNumber: '22/1235',
      fullName: 'Jane Smith',
      hallId: 'neal-wilson',
      roomNumber: 'B202',
      bloodGroup: 'A+',
      genotype: 'AS',
      allergies: [],
      conditions: []
    },
    {
      email: 'mike.johnson@student.babcock.edu.ng',
      password: 'password123',
      matricNumber: '22/1236',
      fullName: 'Mike Johnson',
      hallId: 'nelson-mandela',
      roomNumber: 'C303',
      bloodGroup: 'B+',
      genotype: 'AA',
      allergies: ['Shellfish'],
      conditions: ['Diabetes']
    }
  ],
  cubicle: [
    {
      email: 'sarah.williams@cubicle.babcock.edu.ng',
      password: 'password123',
      fullName: 'Sarah Williams',
      hallId: 'welch'
    },
    {
      email: 'david.brown@cubicle.babcock.edu.ng',
      password: 'password123',
      fullName: 'David Brown',
      hallId: 'neal-wilson'
    }
  ],
  admin: [
    {
      email: 'admin@babcock.edu.ng',
      password: 'admin123',
      fullName: 'System Administrator'
    }
  ]
}

async function createUser(email: string, password: string, userData: any) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData
    })

    if (authError) {
      console.error(`Failed to create auth user ${email}:`, authError.message)
      return null
    }

    console.log(`✓ Created auth user: ${email}`)
    return authData.user
  } catch (error) {
    console.error(`Error creating user ${email}:`, error)
    return null
  }
}

async function createProfile(userId: string, profileData: any) {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData
      })

    if (error) {
      console.error(`Failed to create profile for ${profileData.email}:`, error.message)
      return false
    }

    console.log(`✓ Created profile for: ${profileData.email}`)
    return true
  } catch (error) {
    console.error(`Error creating profile for ${profileData.email}:`, error)
    return false
  }
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')

  // Create students
  console.log('👨‍🎓 Creating student accounts...')
  for (const student of sampleUsers.students) {
    const user = await createUser(student.email, student.password, {
      matric_number: student.matricNumber,
      role: 'student'
    })

    if (user) {
      await createProfile(user.id, {
        email: student.email,
        role: 'student',
        matric_number: student.matricNumber,
        full_name: student.fullName,
        hall_id: student.hallId,
        room_number: student.roomNumber,
        blood_group: student.bloodGroup,
        genotype: student.genotype,
        allergies: student.allergies,
        conditions: student.conditions
      })
    }
  }

  // Create cubicle staff
  console.log('\n🏥 Creating cubicle staff accounts...')
  for (const staff of sampleUsers.cubicle) {
    const user = await createUser(staff.email, staff.password, {
      role: 'cubicle'
    })

    if (user) {
      await createProfile(user.id, {
        email: staff.email,
        role: 'cubicle',
        full_name: staff.fullName,
        hall_id: staff.hallId
      })
    }
  }

  // Create admin
  console.log('\n👑 Creating admin account...')
  for (const admin of sampleUsers.admin) {
    const user = await createUser(admin.email, admin.password, {
      role: 'admin'
    })

    if (user) {
      await createProfile(user.id, {
        email: admin.email,
        role: 'admin',
        full_name: admin.fullName
      })
    }
  }

  console.log('\n✅ Database seeding completed!')
  console.log('\n📋 Demo Accounts:')
  console.log('Students:')
  sampleUsers.students.forEach(student => {
    console.log(`  ${student.email} - ${student.password} (${student.fullName})`)
  })
  console.log('Cubicle Staff:')
  sampleUsers.cubicle.forEach(staff => {
    console.log(`  ${staff.email} - ${staff.password} (${staff.fullName})`)
  })
  console.log('Admin:')
  sampleUsers.admin.forEach(admin => {
    console.log(`  ${admin.email} - ${admin.password} (${admin.fullName})`)
  })
}

// Run the seeding script
seedDatabase().catch(console.error)