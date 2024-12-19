import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './BarraLateral.css';

const BarraLateral = ({ userName, userRole, userIcon, menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleInicioClick = () => {
    // Redirige a la página de inicio dependiendo del rol
    if (userRole === 'Administrador') {
      navigate('/administrador/inicio');
    } else if (userRole === 'Conductor') {
      navigate('/conductor/inicio');
    } else if (userRole === 'Estudiante') {
      navigate('/estudiante/inicio');
    }

  };

  return (
    <div className="barra-lateral">
      <div className="barra-lateral-header">
        <img src={userIcon} alt="Icono del usuario" className="barra-lateral-icon" />
        <div>
          <p className="barra-lateral-name">{userName}</p>
          <p className="barra-lateral-role">{userRole}</p>
        </div>
      </div>
      <nav className="barra-lateral-menu">
        {menuItems.map((item, index) => (
          item.label === 'Inicio' ? (
            // Para "Inicio", aplicamos un evento de clic que verifica el rol
            <div
              key={index}
              className={`barra-lateral-item ${
                (userRole === 'Administrador' && location.pathname === '/administrador/inicio') ||
                (userRole === 'Conductor' && location.pathname === '/conductor/inicio') || 
                (userRole === 'Estudiante' && location.pathname === '/estudiante/inicio')
                  ? 'active'
                  : ''
              }`}
              onClick={handleInicioClick}
            >
              {item.label}
            </div>
          ) : (
            <NavLink
              to={item.link}
              key={index}
              className={({ isActive }) =>
                isActive ? 'barra-lateral-item active' : 'barra-lateral-item'
              }
            >
              {item.label}
            </NavLink>
          )
        ))}
      </nav>
    </div>
  );
};

BarraLateral.propTypes = {
  userName: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  userIcon: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BarraLateral;
