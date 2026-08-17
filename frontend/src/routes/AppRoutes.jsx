import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import ProjectsAdmin from "../pages/admin/ProjectsAdmin";
import MessagesAdmin from "../pages/admin/MessagesAdmin";
import ProfileAdmin from "../pages/admin/ProfileAdmin";
import ResumesAdmin from "../pages/admin/ResumesAdmin";
import AdminLayout from "../layouts/AdminLayout";

function Protected({ children }) {
  return localStorage.getItem("token") ? (
    children
  ) : (
    <Navigate to="/admin/login" />
  );
}
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <Protected>
            <AdminLayout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="resumes" element={<ResumesAdmin />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
