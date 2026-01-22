import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: any =
  url && anon
    ? createClient(url, anon)
    : {
        auth: {
          signInWithPassword: async ({ email, password: _password }: { email: string; password: string }) => ({
            data: { user: { id: 'local-user', email }, session: { token: 'local-token' } },
            error: null
          }),
          signUp: async ({ email, password: _password }: { email: string; password: string }) => ({
            data: { user: { id: 'local-user', email }, session: { token: 'local-token' } },
            error: null
          }),
          signOut: async () => ({}),
          getSession: async () => ({ data: { session: null }, error: null }),
          signInWithOtp: async ({ email: _email }: { email: string }) => ({ data: {}, error: null })
        },
        from: (_table: string) => ({
          select: (_?: string) => Promise.resolve({ data: [], error: null }),
          insert: (payload: any) => Promise.resolve({ data: payload, error: null }),
          update: (payload: any) => Promise.resolve({ data: payload, error: null }),
          delete: () => Promise.resolve({ data: null, error: null }),
          eq: (_c: string, _v: any) => ({
            select: (_?: string) => Promise.resolve({ data: [], error: null }),
            order: (_: string, __?: any) => Promise.resolve({ data: [], error: null }),
            single: () => Promise.resolve({ data: null, error: null })
          }),
          in: (_c: string, _v: any[]) => ({
            select: (_?: string) => Promise.resolve({ data: [], error: null }),
            order: (_: string, __?: any) => Promise.resolve({ data: [], error: null })
          }),
          order: (_: string, __?: any) => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null })
        })
      };
