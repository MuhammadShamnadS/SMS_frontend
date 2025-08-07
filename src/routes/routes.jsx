// src/routes/index.jsx
import React from "react";
import { Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import RequireAuth from "../components/RequireAuth";
import LoginPage from "../pages/LoginPage";
import DashboardRouter from "../pages/dashboards/DashboardRouter";
import StudentRegisterForm from "../pages/dashboards/Admin/RegisterStudentForm";
import TeacherRegisterForm from "../pages/dashboards/Admin/RegisterTeacherForm";
import EditTeacherForm from "../pages/dashboards/Admin/TeacherEditForm";
import EditStudentForm from "../pages/dashboards/Admin/StudentEditForm";
import AllTeachers from "../pages/dashboards/Admin/AllTeachers";
import AllStudents from "../pages/dashboards/Admin/AllStudents";
import TeacherDashboard from "../pages/dashboards/Teachers/TeacherDashboard";
import StudentDashboardPage from "../pages/dashboards/Students/StudentDashboard";
import StudentsUnderTeacher from "../pages/dashboards/Admin/StudentUnderTeacher";
import MyStudents from "../pages/dashboards/Teachers/TeacherViewStudents";


const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardRouter /> },
          { path: "students", element: <RequireAuth allowedRoles={["admin"]}><AllStudents /></RequireAuth> },
          { path: "teachers", element: <RequireAuth allowedRoles={["admin"]}><AllTeachers /></RequireAuth> },
          { path: "register/student", element: <RequireAuth allowedRoles={["admin"]}><StudentRegisterForm /></RequireAuth>, },
          { path: "register/teacher", element: <RequireAuth allowedRoles={["admin"]}><TeacherRegisterForm /></RequireAuth>, },
          { path: "teachers/:id/edit", element: ( <RequireAuth allowedRoles={["admin"]}><EditTeacherForm /></RequireAuth>), },
          { path: "students/:id/edit", element: ( <RequireAuth allowedRoles={["admin"]}><EditStudentForm /></RequireAuth>), },
          { path: "teacher/:teacherId/students", element: <RequireAuth allowedRoles={["admin"]}><StudentsUnderTeacher /></RequireAuth> },
         

          { path: "teacher", element: <RequireAuth allowedRoles={["teacher"]}><TeacherDashboard /></RequireAuth> },
          { path: "teachers/student", element: <RequireAuth allowedRoles={["teacher"]}><MyStudents /></RequireAuth> },
          

          { path: "student", element: <RequireAuth allowedRoles={["student"]}><StudentDashboardPage /></RequireAuth> },
        
        
],
  },
],
  },
]



export default routes;
