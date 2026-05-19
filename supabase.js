
import { createClient } from '@supabase/supabase-js';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(
  'https://dibdzlhbtxpecdvvdvns.supabase.co',

  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpYmR6bGhidHhwZWNkdnZkdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMDY4MDYsImV4cCI6MjA5NDU4MjgwNn0.SKijYuIxtOTP2QfMV5BxMQLhxu8RhaDKLuM3L2h3XlI',

  {
    auth: {
      storage: AsyncStorage,

      autoRefreshToken: true,

      persistSession: true,

      detectSessionInUrl: false,
    },
  }
);
