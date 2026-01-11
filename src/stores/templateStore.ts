import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface Template {
  id: string
  name: string
  description: string | null
  thumbnail_url: string | null
  download_url: string | null
  is_public: boolean
  is_premium: boolean
  category_id: string
  user_id: string
  tags: string[] | null
  dimensions: any | null
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  type: 'moto' | 'voiture' | 'maison' | 'bateau'
  specifications: any | null
}

interface TemplateState {
  templates: Template[]
  categories: Category[]
  loading: boolean
  error: string | null
  
  fetchTemplates: (filters?: { category?: string; type?: string; isPublic?: boolean }) => Promise<void>
  fetchCategories: () => Promise<void>
  createTemplate: (data: any) => Promise<void>
  downloadTemplate: (templateId: string, format: 'pdf' | 'svg' | 'png' | 'dxf') => Promise<void>
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  categories: [],
  loading: false,
  error: null,

  fetchTemplates: async (filters = {}) => {
    set({ loading: true, error: null })
    try {
      let query = supabase.from('templates').select('*')
      
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }
      
      if (filters.type) {
        const { data: categories } = await supabase
          .from('categories')
          .select('id')
          .eq('type', filters.type)
        
        if (categories && categories.length > 0) {
          const categoryIds = categories.map(c => c.id)
          query = query.in('category_id', categoryIds)
        }
      }
      
      if (filters.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      
      set({ templates: data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      
      if (error) throw error
      
      set({ categories: data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createTemplate: async (templateData: any) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert(templateData)
        .select()
        .single()
      
      if (error) throw error
      
      set((state) => ({
        templates: [data, ...state.templates],
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  downloadTemplate: async (templateId: string, format: 'pdf' | 'svg' | 'png' | 'dxf') => {
    try {
      const { data, error } = await supabase
        .from('downloads')
        .insert({
          template_id: templateId,
          format,
        })
      
      if (error) throw error
      
      // Ici on pourrait générer le fichier et le télécharger
      // Pour l'instant on enregistre juste le téléchargement
    } catch (error: any) {
      throw error
    }
  },
}))