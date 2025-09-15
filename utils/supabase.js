import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksguddzgxopotuyyunbc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZ3VkZHpneG9wb3R1eXl1bmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjA5NjksImV4cCI6MjA3MjU5Njk2OX0.VVMfKLmW-bhsdnIH3hcJSwLoTqqCv5B4Sr-7i-eL79g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;