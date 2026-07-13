import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';
import { Bell, LogOut } from 'lucide-react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  .adm-header {
    position: sticky; top: 0; z-index: 40;
    height: 60px;
    background: rgba(4,9,6,0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(52,211,153,0.12);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; gap: 16px;
    font-family: 'DM Sans', sans-serif;
  }
  .adm-header-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 1rem; color: #e7f6ee; letter-spacing: -0.02em;
  }
  .adm-header-right { display: flex; align-items: center; gap: 10px; }
  .adm-bell {
    position: relative; width: 36px; height: 36px;
    border-radius: 10px; border: 1px solid rgba(52,211,153,0.12);
    background: rgba(52,211,153,0.05);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(180,220,200,0.5);
    transition: background 0.2s, color 0.2s;
  }
  .adm-bell:hover { background: rgba(52,211,153,0.1); color: #34d399; }
  .adm-bell-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px; border-radius: 50%;
    background: #f09595; border: 1.5px solid #040906;
    animation: adm-pulse 2s infinite;
  }
  @keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .adm-user-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 12px 5px 5px; border-radius: 24px;
    background: rgba(52,211,153,0.06);
    border: 1px solid rgba(52,211,153,0.12);
  }
  .adm-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #34d399, #059669);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 0.75rem; color: #030f07;
  }
  .adm-user-name { font-size: 0.8rem; font-weight: 600; color: #e7f6ee; }
  .adm-user-role { font-size: 0.65rem; color: #34d399; letter-spacing: 0.05em; text-transform: uppercase; }
  .adm-logout {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 10px;
    background: rgba(240,149,149,0.08);
    border: 1px solid rgba(240,149,149,0.2);
    color: #f09595; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, border-color 0.2s;
  }
  .adm-logout:hover { background: rgba(240,149,149,0.15); border-color: rgba(240,149,149,0.4); }
  @media(max-width:640px){
    .adm-header { padding: 0 12px; }
    .adm-user-name, .adm-user-role { display: none; }
    .adm-logout-text { display: none; }
  }
`;

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AU';

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <>
      <style>{css}</style>
      <header className="adm-header">
        <div className="adm-header-title">Admin Dashboard</div>
        <div className="adm-header-right">
          <button className="adm-bell" aria-label="Notifications">
            <Bell style={{ width: 16, height: 16 }} />
            <span className="adm-bell-dot" />
          </button>
          <div className="adm-user-pill">
            <div className="adm-avatar">{initials}</div>
            <div>
              <div className="adm-user-name">{user?.name || 'Admin'}</div>
              <div className="adm-user-role">Super Admin</div>
            </div>
          </div>
          <button className="adm-logout" onClick={handleLogout}>
            <LogOut style={{ width: 14, height: 14 }} />
            <span className="adm-logout-text">Logout</span>
          </button>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
