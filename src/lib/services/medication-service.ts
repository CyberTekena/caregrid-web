import { supabase } from '../supabase'
import type { Database } from '@/types/database'

export type Medication = Database['public']['Tables']['medications']['Row']
export type MedicationInsert = Database['public']['Tables']['medications']['Insert']
export type MedicationUpdate = Database['public']['Tables']['medications']['Update']

export const medicationService = {
  async getByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('student_id', studentId)
      .order('schedule_time')
    
    if (error) throw error
    return data
  },

  async create(medication: MedicationInsert) {
    const { data, error } = await supabase
      .from('medications')
      .insert(medication)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: MedicationUpdate) {
    const { data, error } = await supabase
      .from('medications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async markTaken(id: string) {
    const { data, error } = await supabase
      .from('medications')
      .update({ last_taken: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}