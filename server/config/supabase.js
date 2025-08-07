import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return supabaseUrl &&
         supabaseKey &&
         !supabaseUrl.includes('your-project') &&
         !supabaseKey.includes('your-anon-key') &&
         supabaseUrl.startsWith('https://');
};

// Lazy-loaded Supabase client
let supabaseClient = null;

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
};

// Export a safe supabase object that checks configuration
export const supabase = {
  get client() {
    return getSupabaseClient();
  },
  auth: {
    get signUp() { return getSupabaseClient().auth.signUp.bind(getSupabaseClient().auth); },
    get signInWithPassword() { return getSupabaseClient().auth.signInWithPassword.bind(getSupabaseClient().auth); },
    get signOut() { return getSupabaseClient().auth.signOut.bind(getSupabaseClient().auth); },
    get resend() { return getSupabaseClient().auth.resend.bind(getSupabaseClient().auth); }
  },
  from(table) { return getSupabaseClient().from(table); }
};

// Helper function to get user profile
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('faculty_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Helper function to create user profile
export const createUserProfile = async (userId, profileData) => {
  // Generate faculty code
  const facultyCode = await generateUniqueFacultyCode();
  
  const { data, error } = await supabase
    .from('faculty_profiles')
    .insert([{
      user_id: userId,
      name: profileData.name,
      department: profileData.department,
      faculty_code: facultyCode,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  
  return data;
};

// Generate unique faculty code
const generateUniqueFacultyCode = async () => {
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    code = `CS${randomNum}`;
    
    // Check if code exists
    const { data } = await supabase
      .from('faculty_profiles')
      .select('faculty_code')
      .eq('faculty_code', code)
      .single();
    
    if (!data) {
      isUnique = true;
    }
  }
  
  return code;
};

export default supabase;
