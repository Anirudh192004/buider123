import { supabase, getUserProfile, createUserProfile } from "../config/supabase.js";

// Signup with email verification
export const signup = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    
    if (!name || !email || !password || !department) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          department
        }
      }
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return res.status(400).json({ 
        success: false, 
        message: authError.message 
      });
    }

    if (authData.user) {
      // Create faculty profile
      const profile = await createUserProfile(authData.user.id, { name, department });
      
      if (!profile) {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to create user profile" 
        });
      }

      res.status(201).json({
        success: true,
        message: "Account created successfully! Please check your email to verify your account.",
        requiresVerification: !authData.user.email_confirmed_at,
        email: email
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to create account"
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Login with Supabase
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return res.status(401).json({ 
        success: false, 
        message: authError.message 
      });
    }

    if (!authData.user.email_confirmed_at) {
      return res.status(401).json({ 
        success: false, 
        message: "Please verify your email before logging in. Check your inbox for the verification link." 
      });
    }

    // Get user profile
    const profile = await getUserProfile(authData.user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: "User profile not found" 
      });
    }

    // Return user data
    const userData = {
      id: profile.id,
      user_id: authData.user.id,
      name: profile.name,
      email: authData.user.email,
      department: profile.department,
      faculty_code: profile.faculty_code,
      created_at: profile.created_at
    };
    
    res.json({
      success: true,
      message: "Login successful",
      user: userData,
      session: authData.session
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Resend email verification
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });

    if (error) {
      console.error('Resend verification error:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }

    res.json({
      success: true,
      message: "Verification email sent successfully"
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Check email verification status
export const checkEmailStatus = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // This is a simplified check - in production you might want to implement this differently
    res.json({
      success: true,
      message: "Please check your email and click the verification link, then try logging in again."
    });
  } catch (error) {
    console.error("Check email status error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
