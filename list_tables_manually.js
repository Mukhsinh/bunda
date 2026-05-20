import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyrvjsgdlqjyjduuqdhf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cnZqc2dkbHFqeWpkdXVxZGhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEyMjY1OCwiZXhwIjoyMDkwNjk4NjU4fQ.RVoVOS2Ii3ilyddycCiTmHFfl1jOYZoA3ZEE9iLwzxU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    console.log('Fetching tables from iyrvjsgdlqjyjduuqdhf...');
    // We can use RPC to check for tables if one exists, 
    // or try to fetch from information_schema via a trick? 
    // Usually we can't fetch from information_schema via REST.
    // BUT! We can check for known tables.
    const tablesToCheck = ['events', 'committees', 'transactions', 'sinergi_consultations', 'sinergi_requests'];

    for (const table of tablesToCheck) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (!error) {
            console.log(`[FOUND] ${table}`);
        } else if (error.code === 'PGRST204') {
            console.log(`[MISSING] ${table}`);
        } else {
            console.log(`[ERROR] ${table}: ${error.code} ${error.message}`);
        }
    }
}

listTables();
