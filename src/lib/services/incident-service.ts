import { supabase } from '../supabase'
import type { Database } from '@/types/database'

export type Incident = Database['public']['Tables']['incidents']['Row']
export type NewIncident = Database['public']['Tables']['incidents']['Insert']

export const incidentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getByHall(hallId: string) {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('hall_id', hallId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async create(incident: NewIncident) {
    const { data, error } = await supabase
      .from('incidents')
      .insert(incident)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: Incident['status']) {
    const { data, error } = await supabase
      .from('incidents')
      .update({ 
        status,
        resolved_at: status === 'resolved' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  subscribeToIncidents(callback: (payload: any) => void) {
    return supabase
      .channel('public:incidents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, callback)
      .subscribe()
  }
}
