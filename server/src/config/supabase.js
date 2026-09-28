import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || 'https://hataawyodibdnnjolvqc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceKey &&
  !supabaseServiceKey.includes('your-supabase')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export function getSupabaseForUser(accessToken) {
  if (!isSupabaseConfigured) return null;
  const anonKey = process.env.SUPABASE_ANON_KEY || supabaseServiceKey;
  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      persistSession: false
    }
  });
}

// In-Memory Database Fallback for smooth local development and zero-downtime testing
let localDataCache = null;
export function getLocalCurriculum() {
  if (!localDataCache) {
    try {
      const dataPath = path.resolve(__dirname, '../data/seedData.json');
      if (fs.existsSync(dataPath)) {
        localDataCache = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      }
    } catch (e) {
      console.warn('Could not read seedData.json for fallback:', e.message);
    }
  }
  return localDataCache || { paths: [], modules: [], questions: [], notes: [] };
}
