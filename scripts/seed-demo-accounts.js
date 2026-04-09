import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
const envPath = join(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}

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

// Current updated halls list (20 halls)
const HALLS = [
  { id: "welch", name: "Welch Hall" },
  { id: "neal-wilson", name: "Neal Wilson Hall" },
  { id: "nelson-mandela", name: "Nelson Mandela Hall" },
  { id: "gideon-troopers", name: "Gideon Troopers Hall" },
  { id: "bethel-splendor", name: "Bethel Splendor Hall" },
  { id: "samuel-akande", name: "Samuel Akande Hall" },
  { id: "adeleke", name: "Adeleke Hall" },
  { id: "emerald", name: "Emerald Hall" },
  { id: "topaz", name: "Topaz Hall" },
  { id: "havilah-gold", name: "Havilah Gold Hall" },
  { id: "crystal", name: "Crystal Hall" },
  { id: "ameyo-adadevoh", name: "Ameyo Adadevoh Hall" },
  { id: "felicia-dada", name: "Felicia Adebisi Dada Hall" },
  { id: "queen-esther", name: "Queen Esther Hall" },
  { id: "white", name: "White Hall" },
  { id: "nyberg", name: "Nyberg Hall" },
  { id: "ogden", name: "Ogden Hall" },
  { id: "platinum", name: "Platinum Hall" },
  { id: "diamond", name: "Diamond Hall" },
  { id: "sapphire", name: "Sapphire Hall" },
]

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
    }
  ],
  // Generate a staff account for EVERY hall
  cubicle: HALLS.map(hall => ({
    email: `staff.${hall.id}@babcock.edu.ng`,
    password: 'password123',
    fullName: `${hall.name} Staff`,
    hallId: hall.id
  })),
  admin: [
    {
      email: 'admin@babcock.edu.ng',
      password: 'admin123',
      fullName: 'System Administrator'
    }
  ]
}

async function createUser(email, password, userData) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const found = existingUser.users.find(u => u.email === email)
    
    if (found) {
      console.log(`- User already exists: ${email}`)
      return found
    }

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

async function createProfile(userId, profileData) {
  try {
    // Upsert profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData
      })

    if (error) {
      console.error(`Failed to create/update profile for ${profileData.email}:`, error.message)
      return false
    }

    console.log(`✓ Created/Updated profile for: ${profileData.email}`)
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
  console.log('\n🏥 Creating cubicle staff accounts for all 20 halls...')
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
  console.log('\n📋 Account Credentials:')
  console.log('Admin:')
  console.log(`  Email: admin@babcock.edu.ng | Password: admin123`)
  console.log('Cubicle Staff Pattern:')
  console.log(`  Email: staff.[hall-id]@babcock.edu.ng | Password: password123`)
  console.log('  Example: staff.welch@babcock.edu.ng')
  console.log('Student:')
  console.log(`  Email: john.doe@student.babcock.edu.ng | Password: password123`)
}

// Run the seeding script
seedDatabase().catch(console.error)
