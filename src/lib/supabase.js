import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iyrvjsgdlqjyjduuqdhf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cnZqc2dkbHFqeWpkdXVxZGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjI2NTgsImV4cCI6MjA5MDY5ODY1OH0.fPjzyUpxoddso40OrQkHS-A6IwOCcwYw5_IOoSZUuJ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
