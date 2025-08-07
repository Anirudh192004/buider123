import { RequestHandler } from "express";
import { getStudentsByFaculty, addStudent, getClassAnalytics, updateStudent, deleteStudent } from "../db/students.js";

// Get analytics for a faculty's class
export const getAnalytics = (req, res) => {
  try {
    const { facultyId } = req.params;
    
    if (!facultyId) {
      return res.status(400).json({ 
        success: false, 
        message: "Faculty ID is required" 
      });
    }

    const analytics = getClassAnalytics(parseInt(facultyId));
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get all students for a faculty
export const getStudents = (req, res) => {
  try {
    const { facultyId } = req.params;
    
    if (!facultyId) {
      return res.status(400).json({ 
        success: false, 
        message: "Faculty ID is required" 
      });
    }

    const students = getStudentsByFaculty(parseInt(facultyId));
    
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Add a new student
export const createStudent = (req, res) => {
  try {
    const { facultyId } = req.params;
    const studentData = req.body;
    
    if (!facultyId) {
      return res.status(400).json({ 
        success: false, 
        message: "Faculty ID is required" 
      });
    }

    if (!studentData.name || !studentData.studentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Student name and ID are required" 
      });
    }

    const newStudent = addStudent({
      ...studentData,
      facultyId: parseInt(facultyId),
      semester: "2024-25"
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: newStudent
    });
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Update student data
export const updateStudentData = (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;
    
    if (!studentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Student ID is required" 
      });
    }

    const updatedStudent = updateStudent(parseInt(studentId), updateData);
    
    if (!updatedStudent) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent
    });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Delete student
export const removeStudent = (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Student ID is required" 
      });
    }

    const deletedStudent = deleteStudent(parseInt(studentId));
    
    if (!deletedStudent) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent
    });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Bulk upload students (for CSV/Excel import)
export const bulkUpload = (req, res) => {
  try {
    const { facultyId } = req.params;
    const { students: studentsData } = req.body;
    
    if (!facultyId) {
      return res.status(400).json({ 
        success: false, 
        message: "Faculty ID is required" 
      });
    }

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Students data array is required" 
      });
    }

    const addedStudents = [];
    const errors = [];

    studentsData.forEach((studentData, index) => {
      try {
        if (!studentData.name || !studentData.studentId) {
          errors.push(`Row ${index + 1}: Student name and ID are required`);
          return;
        }

        const newStudent = addStudent({
          ...studentData,
          facultyId: parseInt(facultyId),
          semester: "2024-25"
        });
        
        addedStudents.push(newStudent);
      } catch (error) {
        errors.push(`Row ${index + 1}: ${error.message}`);
      }
    });

    res.json({
      success: true,
      message: `Successfully uploaded ${addedStudents.length} students`,
      data: {
        added: addedStudents,
        errors: errors
      }
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
