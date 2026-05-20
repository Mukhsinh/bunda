import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTable() {
    console.log(`Checking project: ${supabaseUrl}`);

    // Check if sinergi_requests exists
    const { error } = await supabase.from('sinergi_requests').select('id').limit(1);

    if (error && error.code === 'PGRST204') {
        console.log('Table sinergi_requests not found. I need to create it.');
        // Since we can't run DDL via supabase-js easily, 
        // we hope there's an RPC or we use a different approach.
    } else if (error) {
        console.error('Error checking table:', error);
    } else {
        console.log('Table sinergi_requests already exists!');
    }
}

checkTable();
