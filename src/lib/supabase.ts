import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const createMockBuilder = (mockData: any[] | any = []) => {
  const builder: any = {
    select: () => builder,
    eq: () => builder,
    in: () => builder,
    order: () => builder,
    single: () => Promise.resolve({ data: Array.isArray(mockData) ? mockData[0] : mockData, error: null }),
    insert: (payload: any) => Promise.resolve({ data: payload, error: null }),
    update: (payload: any) => Promise.resolve({ data: payload, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: (value: any) => void) => resolve({ data: mockData, error: null })
  };
  return builder;
};

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
        from: (_table: string) => createMockBuilder([])
      };
