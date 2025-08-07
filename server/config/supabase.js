import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

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
