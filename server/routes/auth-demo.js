// Demo authentication for testing without Supabase
// This simulates email verification without requiring real email setup

const users = new Map(); // In-memory storage for demo

export const demoSignup = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({
        success: false,
        message: "Account already exists with this email",
      });
    }

    // Generate faculty code
    const facultyCode = `CS${Math.floor(Math.random() * 900) + 100}`;

    // Store user as "verified" directly
    users.set(email, {
      name,
      email,
      password,
      department,
      facultyCode,
      verified: true, // Auto-verify for immediate use
      created: new Date(),
    });

    console.log(
      `✅ Faculty account created: ${email} with code ${facultyCode}`,
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        name,
        email,
        department,
        facultyCode,
      },
    });
  } catch (error) {
    console.error("Demo signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const demoVerify = async (req, res) => {
  try {
    const { email, code } = req.query;

    const user = users.get(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.facultyCode !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // Mark as verified
    user.verified = true;
    users.set(email, user);

    res.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
      redirect: "/login",
    });
  } catch (error) {
    console.error("Demo verify error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const demoLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message:
          "Please verify your email first. Check the server console for the verification link.",
      });
    }

    // Return user data
    const userData = {
      id: 1,
      name: user.name,
      email: user.email,
      department: user.department,
      faculty_code: user.facultyCode,
    };

    res.json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Demo login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
