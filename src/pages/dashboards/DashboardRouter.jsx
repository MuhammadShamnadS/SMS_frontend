import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./Admin/AdminDashboard";
import TeacherDashboard from "./Teachers/TeacherDashboard";
import StudentDashboardPage from "./Students/StudentDashboard";


const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "teacher") return <TeacherDashboard />;
  if (user?.role === "student") return <StudentDashboardPage/>;

  

  return <div>Unauthorized or unknown role</div>;
};

export default DashboardRouter;

