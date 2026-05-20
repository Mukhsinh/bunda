import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyrvjsgdlqjyjduuqdhf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cnZqc2dkbHFqeWpkdXVxZGhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEyMjY1OCwiZXhwIjoyMDkwNjk4NjU4fQ.RVoVOS2Ii3ilyddycCiTmHFfl1jOYZoA3ZEE9iLwzxU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Attempting to insert into iyrv...sinergi_requests');
    const { data, error } = await supabase
        .from('sinergi_requests')
        .insert([{ name: 'Test', whatsapp: '0', address: 'Test', status: 'Pending' }])
        .select();

    if (error) {
        console.log('Error caught:', error.code, error.message);
    } else {
        console.log('Success! Table exists and record inserted:', data);
    }
}

testInsert();
