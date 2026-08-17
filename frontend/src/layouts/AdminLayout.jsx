import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function AdminLayout() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    nav('/admin/login');
  };

  const linkClass = ({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`;

  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr]">
      <aside className="bg-slate-950 border-r border-slate-800 p-6">
        <h2 className="text-2xl font-black mb-8">Admin<span className="gradient-text">Panel</span></h2>
        <div className="grid gap-2">
          <NavLink className={linkClass} end to="/admin">Dashboard</NavLink>
          <NavLink className={linkClass} to="/admin/resumes">Resumes</NavLink>
          <NavLink className={linkClass} to="/admin/profile">Live Profile</NavLink>
          <NavLink className={linkClass} to="/admin/messages">Messages</NavLink>
          <a className="btn btn-outline" href="/">View Portfolio</a>
          <ThemeToggle className="justify-center mt-2" />
          <button onClick={logout} className="btn btn-primary mt-4 justify-center">Logout</button>
        </div>
      </aside>
      <main className="p-5 md:p-8"><Outlet /></main>
    </div>
  );
}
