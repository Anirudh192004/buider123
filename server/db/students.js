// Student Database - In-memory storage for demo purposes
// In production, this would be replaced with a proper database

const students = [
  {
    id: 1,
    name: "Alex Johnson",
    studentId: "ST001",
    facultyId: 1, // Dr. Sarah Johnson
    subjects: {
      Mathematics: { score: 92, attendance: 95 },
      Physics: { score: 88, attendance: 90 },
      Chemistry: { score: 85, attendance: 88 },
      English: { score: 94, attendance: 96 },
      Biology: { score: 87, attendance: 92 }
    },
    overallAttendance: 92,
    overallGrade: 89.2,
    status: "excellent",
    semester: "2024-25",
  },
  {
    id: 2,
    name: "Maria Garcia",
    studentId: "ST002",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 78, attendance: 85 },
      Physics: { score: 82, attendance: 88 },
      Chemistry: { score: 80, attendance: 82 },
      English: { score: 85, attendance: 90 },
      Biology: { score: 79, attendance: 86 }
    },
    overallAttendance: 86,
    overallGrade: 80.8,
    status: "good",
    semester: "2024-25",
  },
  {
    id: 3,
    name: "David Chen",
    studentId: "ST003",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 95, attendance: 98 },
      Physics: { score: 93, attendance: 95 },
      Chemistry: { score: 91, attendance: 97 },
      English: { score: 89, attendance: 94 },
      Biology: { score: 92, attendance: 96 }
    },
    overallAttendance: 96,
    overallGrade: 92.0,
    status: "excellent",
    semester: "2024-25",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    studentId: "ST004",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 76, attendance: 80 },
      Physics: { score: 74, attendance: 78 },
      Chemistry: { score: 72, attendance: 75 },
      English: { score: 80, attendance: 85 },
      Biology: { score: 75, attendance: 82 }
    },
    overallAttendance: 80,
    overallGrade: 75.4,
    status: "average",
    semester: "2024-25",
  },
  {
    id: 5,
    name: "James Brown",
    studentId: "ST005",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 88, attendance: 92 },
      Physics: { score: 85, attendance: 89 },
      Chemistry: { score: 90, attendance: 94 },
      English: { score: 87, attendance: 91 },
      Biology: { score: 89, attendance: 93 }
    },
    overallAttendance: 92,
    overallGrade: 87.8,
    status: "good",
    semester: "2024-25",
  },
  {
    id: 6,
    name: "Emily Davis",
    studentId: "ST006",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 94, attendance: 97 },
      Physics: { score: 91, attendance: 94 },
      Chemistry: { score: 93, attendance: 96 },
      English: { score: 96, attendance: 98 },
      Biology: { score: 92, attendance: 95 }
    },
    overallAttendance: 96,
    overallGrade: 93.2,
    status: "excellent",
    semester: "2024-25",
  },
  {
    id: 7,
    name: "Michael Lee",
    studentId: "ST007",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 82, attendance: 88 },
      Physics: { score: 79, attendance: 85 },
      Chemistry: { score: 84, attendance: 90 },
      English: { score: 86, attendance: 92 },
      Biology: { score: 81, attendance: 87 }
    },
    overallAttendance: 88,
    overallGrade: 82.4,
    status: "good",
    semester: "2024-25",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    studentId: "ST008",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 90, attendance: 94 },
      Physics: { score: 87, attendance: 91 },
      Chemistry: { score: 89, attendance: 93 },
      English: { score: 92, attendance: 95 },
      Biology: { score: 88, attendance: 92 }
    },
    overallAttendance: 93,
    overallGrade: 89.2,
    status: "excellent",
    semester: "2024-25",
  },
  {
    id: 9,
    name: "Robert Taylor",
    studentId: "ST009",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 70, attendance: 75 },
      Physics: { score: 68, attendance: 72 },
      Chemistry: { score: 65, attendance: 70 },
      English: { score: 75, attendance: 80 },
      Biology: { score: 72, attendance: 78 }
    },
    overallAttendance: 75,
    overallGrade: 70.0,
    status: "at-risk",
    semester: "2024-25",
  },
  {
    id: 10,
    name: "Jennifer White",
    studentId: "ST010",
    facultyId: 1,
    subjects: {
      Mathematics: { score: 86, attendance: 90 },
      Physics: { score: 83, attendance: 87 },
      Chemistry: { score: 88, attendance: 91 },
      English: { score: 90, attendance: 93 },
      Biology: { score: 85, attendance: 89 }
    },
    overallAttendance: 90,
    overallGrade: 86.4,
    status: "good",
    semester: "2024-25",
  },
];

// Helper functions for student data management
export const getStudentsByFaculty = (facultyId) => {
  return students.filter(student => student.facultyId === facultyId);
};

export const getStudentById = (id) => {
  return students.find(student => student.id === id);
};

export const addStudent = (studentData) => {
  const newId = Math.max(...students.map(s => s.id)) + 1;
  const newStudent = {
    id: newId,
    ...studentData,
  };
  students.push(newStudent);
  return newStudent;
};

export const updateStudent = (id, updateData) => {
  const studentIndex = students.findIndex(student => student.id === id);
  if (studentIndex !== -1) {
    students[studentIndex] = { ...students[studentIndex], ...updateData };
    return students[studentIndex];
  }
  return null;
};

export const deleteStudent = (id) => {
  const studentIndex = students.findIndex(student => student.id === id);
  if (studentIndex !== -1) {
    return students.splice(studentIndex, 1)[0];
  }
  return null;
};

export const getClassAnalytics = (facultyId) => {
  const facultyStudents = getStudentsByFaculty(facultyId);
  
  if (facultyStudents.length === 0) {
    return {
      totalStudents: 0,
      topPerformers: 0,
      averageAttendance: 0,
      atRiskStudents: 0,
      subjectPerformance: {},
      performanceTrends: []
    };
  }

  const totalStudents = facultyStudents.length;
  const topPerformers = facultyStudents.filter(s => s.status === 'excellent').length;
  const atRiskStudents = facultyStudents.filter(s => s.status === 'at-risk').length;
  
  const totalAttendance = facultyStudents.reduce((sum, s) => sum + s.overallAttendance, 0);
  const averageAttendance = Math.round(totalAttendance / totalStudents);

  // Calculate subject-wise performance
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'];
  const subjectPerformance = subjects.map(subject => {
    const totalScore = facultyStudents.reduce((sum, student) => {
      return sum + (student.subjects[subject]?.score || 0);
    }, 0);
    return {
      subject,
      score: Math.round(totalScore / totalStudents)
    };
  });

  // Generate mock performance trends (in a real app, this would come from historical data)
  const performanceTrends = [
    { month: 'Jan', performance: 75 },
    { month: 'Feb', performance: 82 },
    { month: 'Mar', performance: 85 },
    { month: 'Apr', performance: 88 },
    { month: 'May', performance: Math.round(facultyStudents.reduce((sum, s) => sum + s.overallGrade, 0) / totalStudents) },
  ];

  return {
    totalStudents,
    topPerformers,
    averageAttendance,
    atRiskStudents,
    subjectPerformance,
    performanceTrends,
    studentsList: facultyStudents
  };
};

export default students;
