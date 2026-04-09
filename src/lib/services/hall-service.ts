import { supabase } from '../supabase'
import type { Database } from '@/types/database'

export type Hall = Database['public']['Tables']['halls']['Row']
export type HallInsert = Database['public']['Tables']['halls']['Insert']
export type HallUpdate = Database['public']['Tables']['halls']['Update']

export const hallService = {
  async getAll() {
    const { data, error } = await supabase
      .from('halls')
      .select('*')
      .order('name')

    if (error) throw error
    return data ?? []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('halls')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(hall: HallInsert) {
    const { data, error } = await supabase
      .from('halls')
      .insert(hall)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: HallUpdate) {
    const { data, error } = await supabase
      .from('halls')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('halls')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}