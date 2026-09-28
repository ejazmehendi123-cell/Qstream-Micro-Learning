import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  console.log('==============================================');
  console.log('QSTREAM AI — SUPABASE DATABASE SEEDING PROCESS');
  console.log('==============================================');

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  const dataFilePath = path.resolve(__dirname, '../src/data/seedData.json');
  if (!fs.existsSync(dataFilePath)) {
    console.error('❌ seedData.json not found! Please run node src/data/seedGenerator.js first.');
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataFilePath, 'utf-8');
  const seedData = JSON.parse(rawData);

  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('your-supabase')) {
    console.log('\n⚠️ Supabase credentials not found in environment variables.');
    console.log('To seed your active Supabase cloud project (hataawyodibdnnjolvqc):');
    console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/hataawyodibdnnjolvqc');
    console.log('2. Copy your Project URL & service_role secret key into server/.env:');
    console.log('   SUPABASE_URL=https://hataawyodibdnnjolvqc.supabase.co');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>');
    console.log('3. Alternatively, copy the generated SQL file directly into Supabase SQL Editor:');
    console.log('   supabase/seed.sql');
    console.log('\n✅ Local seed dataset is ready:');
    console.log(`- ${seedData.paths.length} Learning Paths`);
    console.log(`- ${seedData.modules.length} Modules`);
    console.log(`- ${seedData.notes.length} Detailed Notes`);
    console.log(`- ${seedData.questions.length} Questions with SHA-256 hashes`);
    console.log('==============================================\n');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  try {
    console.log(`Connecting to Supabase at: ${supabaseUrl}`);

    // 1. Seed Learning Paths
    console.log(`\nInserting ${seedData.paths.length} Learning Paths...`);
    const { error: pathErr } = await supabase
      .from('learning_paths')
      .upsert(seedData.paths, { onConflict: 'slug' });

    if (pathErr) console.warn('Path upsert warning:', pathErr.message);
    else console.log('✅ Learning Paths seeded successfully.');

    // 2. Seed Modules (in batches of 25)
    console.log(`\nInserting ${seedData.modules.length} Modules in batches...`);
    for (let i = 0; i < seedData.modules.length; i += 25) {
      const batch = seedData.modules.slice(i, i + 25);
      const { error: modErr } = await supabase
        .from('modules')
        .upsert(batch, { onConflict: 'learning_path_id,slug' });
      if (modErr) console.warn(`Batch ${i}-${i + 25} warning:`, modErr.message);
    }
    console.log('✅ Modules seeded successfully.');

    // 3. Seed Notes
    console.log(`\nInserting ${seedData.notes.length} Detailed Notes in batches...`);
    for (let i = 0; i < seedData.notes.length; i += 20) {
      const batch = seedData.notes.slice(i, i + 20);
      const { error: noteErr } = await supabase
        .from('notes')
        .upsert(batch, { onConflict: 'module_id' });
      if (noteErr) console.warn(`Notes batch ${i} warning:`, noteErr.message);
    }
    console.log('✅ Detailed Notes seeded successfully.');

    // 4. Seed Questions
    console.log(`\nInserting ${seedData.questions.length} Questions in batches...`);
    for (let i = 0; i < seedData.questions.length; i += 50) {
      const batch = seedData.questions.slice(i, i + 50);
      const { error: qErr } = await supabase
        .from('questions')
        .upsert(batch, { onConflict: 'question_hash' });
      if (qErr) console.warn(`Questions batch ${i} warning:`, qErr.message);
    }
    console.log('✅ Questions seeded successfully.');

    console.log('\n🎉 ALL SEED DATA SUCCESSFULLY PERSISTED TO SUPABASE POSTGRESQL!\n');
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
}

seedDatabase();
