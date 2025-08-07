// Faculty Database - In-memory storage for demo purposes
// In production, this would be replaced with a proper database

const faculty = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    facultyCode: "CS001",
    password: "password123", // In production, this would be hashed
    department: "Computer Science",
    isVerified: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    facultyCode: "CS002",
    password: "password123",
    department: "Computer Science",
    isVerified: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    facultyCode: "CS003",
    password: "password123",
    department: "Mathematics",
    isVerified: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 4,
    name: "Prof. David Kim",
    email: "david.kim@university.edu",
    facultyCode: "CS004",
    password: "password123",
    department: "Physics",
    isVerified: true,
    createdAt: new Date("2024-02-05"),
  },
  {
    id: 5,
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@university.edu",
    facultyCode: "CS005",
    password: "password123",
    department: "Chemistry",
    isVerified: true,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: 6,
    name: "Prof. James Wilson",
    email: "james.wilson@university.edu",
    facultyCode: "CS006",
    password: "password123",
    department: "English",
    isVerified: true,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: 7,
    name: "Dr. Maria Garcia",
    email: "maria.garcia@university.edu",
    facultyCode: "CS007",
    password: "password123",
    department: "Biology",
    isVerified: true,
    createdAt: new Date("2024-02-20"),
  },
  {
    id: 8,
    name: "Prof. Robert Taylor",
    email: "robert.taylor@university.edu",
    facultyCode: "CS008",
    password: "password123",
    department: "Computer Science",
    isVerified: true,
    createdAt: new Date("2024-02-25"),
  },
  {
    id: 9,
    name: "Dr. Amanda White",
    email: "amanda.white@university.edu",
    facultyCode: "CS009",
    password: "password123",
    department: "Mathematics",
    isVerified: true,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: 10,
    name: "Prof. Kevin Brown",
    email: "kevin.brown@university.edu",
    facultyCode: "CS010",
    password: "password123",
    department: "Physics",
    isVerified: true,
    createdAt: new Date("2024-03-05"),
  },
  {
    id: 11,
    name: "Dr. Jennifer Lee",
    email: "jennifer.lee@university.edu",
    facultyCode: "CS011",
    password: "password123",
    department: "Chemistry",
    isVerified: true,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: 12,
    name: "Prof. Daniel Martinez",
    email: "daniel.martinez@university.edu",
    facultyCode: "CS012",
    password: "password123",
    department: "English",
    isVerified: true,
    createdAt: new Date("2024-03-15"),
  },
  {
    id: 13,
    name: "Dr. Rachel Thompson",
    email: "rachel.thompson@university.edu",
    facultyCode: "CS013",
    password: "password123",
    department: "Biology",
    isVerified: true,
    createdAt: new Date("2024-03-20"),
  },
  {
    id: 14,
    name: "Prof. Steven Davis",
    email: "steven.davis@university.edu",
    facultyCode: "CS014",
    password: "password123",
    department: "Computer Science",
    isVerified: true,
    createdAt: new Date("2024-03-25"),
  },
  {
    id: 15,
    name: "Dr. Catherine Moore",
    email: "catherine.moore@university.edu",
    facultyCode: "CS015",
    password: "password123",
    department: "Mathematics",
    isVerified: true,
    createdAt: new Date("2024-03-30"),
  },
];

// Helper functions for faculty management
export const findFacultyByEmail = (email) => {
  return faculty.find(f => f.email.toLowerCase() === email.toLowerCase());
};

export const findFacultyByCode = (facultyCode) => {
  return faculty.find(f => f.facultyCode === facultyCode);
};

export const addFaculty = (facultyData) => {
  const newId = Math.max(...faculty.map(f => f.id)) + 1;
  const newFaculty = {
    id: newId,
    ...facultyData,
    createdAt: new Date(),
    isVerified: false,
  };
  faculty.push(newFaculty);
  return newFaculty;
};

export const generateFacultyCode = () => {
  const existingCodes = faculty.map(f => f.facultyCode);
  let code;
  do {
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    code = `CS${randomNum}`;
  } while (existingCodes.includes(code));
  return code;
};

export const verifyFaculty = (email) => {
  const faculty_member = findFacultyByEmail(email);
  if (faculty_member) {
    faculty_member.isVerified = true;
    return true;
  }
  return false;
};

export default faculty;
