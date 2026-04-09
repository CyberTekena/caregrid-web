import { supabase } from '../supabase'
import type { Database } from '@/types/database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const profileService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error && status !== 406) throw error
    return data ?? null
  },

  async getById(id: string) {
    const { data, error, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error && status !== 406) throw error
    return data
  },

  async create(profile: ProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name')
    
    if (error) throw error
    return data ?? []
  },

  async getAllStudents() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('full_name')
    
    if (error) throw error
    return data ?? []
  },

  async getByRole(role: 'student' | 'cubicle' | 'admin') {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('full_name')
    
    if (error) throw error
    return data
  },

  async getStudentCount() {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')
    
    if (error) throw error
    return count || 0
  }
}