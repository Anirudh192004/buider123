import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { login, signup, verifyCode, checkEmail } from "./routes/auth.js";
import { getAnalytics, getStudents, createStudent, updateStudentData, removeStudent, bulkUpload } from "./routes/students.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/verify", verifyCode);
  app.get("/api/auth/check-email", checkEmail);

  // Student data routes
  app.get("/api/faculty/:facultyId/analytics", getAnalytics);
  app.get("/api/faculty/:facultyId/students", getStudents);
  app.post("/api/faculty/:facultyId/students", createStudent);
  app.post("/api/faculty/:facultyId/students/bulk", bulkUpload);
  app.put("/api/students/:studentId", updateStudentData);
  app.delete("/api/students/:studentId", removeStudent);

  return app;
}
