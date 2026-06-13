import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  SUPABASE_URL або SUPABASE_ANON_KEY не налаштовані. Auth не працюватиме.');
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default supabase;
