import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://savaiqxwifbruseyizke.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdmFpcXh3aWZicnVzZXlpemtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxODc2OTIsImV4cCI6MjA5ODc2MzY5Mn0.DlRvNaDdPHXh7HK17qY-H8VDAvqadf__LjRhF3WgjsM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  const tables = ['users', 'wishlists', 'conversations', 'history'];

  for (const table of tables) {
    try {
      const { data, error, status } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ Table "${table}" - ERROR: ${error.message}`);
      } else {
        console.log(`✅ Table "${table}" - Connected! (HTTP ${status}, ${data.length} rows)`);
      }
    } catch (err) {
      console.log(`❌ Table "${table}" - EXCEPTION: ${err.message}`);
    }
  }

  // Test auth endpoint
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log(`\n❌ Auth Service - ERROR: ${error.message}`);
    } else {
      console.log(`\n✅ Auth Service - Connected! (No active session, as expected)`);
    }
  } catch (err) {
    console.log(`\n❌ Auth Service - EXCEPTION: ${err.message}`);
  }

  console.log('\n🎉 Connection test complete!');
}

testConnection();
