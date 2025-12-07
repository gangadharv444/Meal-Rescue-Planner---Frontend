import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://uzayyhkfvdpeiwxifzza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6YXl5aGtmdmRwZWl3eGlmenphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjAyMTUsImV4cCI6MjA3MzY5NjIxNX0.OdJfp_1qpN4qHX-gWHZX7uRM_h34iKig20XNYh2DkKo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
