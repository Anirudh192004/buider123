import { findFacultyByEmail, addFaculty, generateFacultyCode, verifyFaculty } from "../db/faculty.js";

// Login endpoint
export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const faculty = findFacultyByEmail(email);
    
    if (!faculty) {
      return res.status(401).json({ 
        success: false, 
        message: "Account not found. Please sign up first." 
      });
    }

    if (faculty.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    if (!faculty.isVerified) {
      return res.status(401).json({ 
        success: false, 
        message: "Account not verified. Please check your email for verification code." 
      });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = faculty;
    
    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Signup endpoint
export const signup = (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    
    if (!name || !email || !password || !department) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if faculty already exists
    const existingFaculty = findFacultyByEmail(email);
    if (existingFaculty) {
      return res.status(409).json({ 
        success: false, 
        message: "Account already exists. Please login instead." 
      });
    }

    // Generate faculty code
    const facultyCode = generateFacultyCode();

    // Create new faculty
    const newFaculty = addFaculty({
      name,
      email,
      password,
      department,
      facultyCode,
    });

    // Simulate sending email (in production, this would send actual email)
    console.log(`Email sent to ${email}: Your faculty code is ${facultyCode}`);

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please check your email for verification code.",
      facultyCode, // In production, this would not be returned
      email
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Verify faculty code endpoint
export const verifyCode = (req, res) => {
  try {
    const { email, facultyCode } = req.body;
    
    if (!email || !facultyCode) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and faculty code are required" 
      });
    }

    const faculty = findFacultyByEmail(email);
    
    if (!faculty) {
      return res.status(404).json({ 
        success: false, 
        message: "Account not found" 
      });
    }

    if (faculty.facultyCode !== facultyCode) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid faculty code" 
      });
    }

    // Verify the faculty
    verifyFaculty(email);

    res.json({
      success: true,
      message: "Account verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Check if email exists endpoint
export const checkEmail = (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    const faculty = findFacultyByEmail(email);
    
    res.json({
      success: true,
      exists: !!faculty,
      verified: faculty ? faculty.isVerified : false
    });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
