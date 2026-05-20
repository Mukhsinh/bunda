import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyrvjsgdlqjyjduuqdhf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cnZqc2dkbHFqeWpkdXVxZGhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEyMjY1OCwiZXhwIjoyMDkwNjk4NjU4fQ.RVoVOS2Ii3ilyddycCiTmHFfl1jOYZoA3ZEE9iLwzxU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log('Checking columns of sinergi_requests...');
    const { data, error } = await supabase.from('sinergi_requests').select('*').limit(1);
    if (error) {
        console.log('Error:', error.message);
    } else {
        console.log('Headers:', data.length > 0 ? Object.keys(data[0]) : 'Empty table, but it exists!');
        // We can't see columns of empty table via select * unfortunately if no rows.
    }
}

checkColumns();
