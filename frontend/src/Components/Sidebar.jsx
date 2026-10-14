import React, { useState } from "react";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import ImagoTipo from "./Logo"; // Cargamos el logotipo oficial de la app

const Sidebar = ({ menuItems = [], onLogout }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInternalLogout = () => {
    handleClose();
    if (onLogout) onLogout();
    navigate("/login");
  };

  const MenuContent = () => (
    <div className="d-flex flex-column h-100 sp-sidebar-inner">
      {/* Brand Header con ImagoTipo oficial */}
      <div className="p-4 flex-shrink-0 text-start">
        <Link to="/inicio" onClick={handleClose} className="text-decoration-none">
          <ImagoTipo size={34} variant="negativo" />
        </Link>
      </div>

      <hr className="sp-sidebar-divider mx-3 my-0" />

      {/* Navegación Principal */}
      <Nav
        className="flex-column px-3 py-3 flex-grow-1"
        style={{ overflowY: "auto" }}
        onClick={handleClose}
      >
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.Icon;

          return (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`sp-nav-item ${isActive ? "active" : ""}`}
            >
              {Icon && <Icon className="sp-nav-icon" />}
              <span>{item.name}</span>
            </Nav.Link>
          );
        })}
      </Nav>

      {/* Botón de Salida */}
      {onLogout && (
        <div className="p-3 flex-shrink-0 border-top border-secondary border-opacity-25">
          <Button
            variant="link"
            onClick={handleInternalLogout}
            className="sp-logout-btn"
          >
            <FaSignOutAlt className="me-2" /> Cerrar Sesión
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Botón Flotante para Pantallas Móviles */}
      <div
        className="d-lg-none position-fixed p-3"
        style={{ zIndex: 1050, top: 0, left: 0 }}
      >
        <Button
          variant="light"
          onClick={handleShow}
          className="shadow-sm border-0"
          style={{ background: "var(--noche)", color: "#fff" }}
        >
          <FaBars />
        </Button>
      </div>

      {/* Sidebar para Escritorio */}
      <aside className="d-none d-lg-block sp-sidebar-fixed">
        <MenuContent />
      </aside>

      {/* Offcanvas para Dispositivos Móviles */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="sp-sidebar-offcanvas"
      >
        <Offcanvas.Header closeButton closeVariant="white" />
        <Offcanvas.Body className="p-0">
          <MenuContent />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Estilos CSS del Sidebar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        :root {
          --azul: #2A5DB0;
          --noche: #14295C;
          --verde: #2FC57E;
          --celeste: #E3EEFB;
          --pizarra: #4A5878;
          --borde: #D3E0F3;
        }

        .sp-sidebar-fixed {
          width: 260px;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 1000;
          background: var(--noche);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          font-family: 'Poppins', sans-serif;
        }

        .sp-sidebar-offcanvas {
          background: var(--noche) !important;
          width: 260px !important;
          font-family: 'Poppins', sans-serif;
        }

        .sp-sidebar-inner {
          background: var(--noche);
          color: #fff;
        }

        .sp-sidebar-divider {
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        .sp-nav-item {
          color: #C9D6EE !important;
          font-weight: 500;
          font-size: 0.92rem;
          padding: 0.75rem 1rem !important;
          border-radius: 12px;
          margin-bottom: 0.35rem;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .sp-nav-item:hover {
          color: #fff !important;
          background: rgba(255, 255, 255, 0.06);
        }

        .sp-nav-item.active {
          color: #fff !important;
          background: var(--azul) !important;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(42, 93, 176, 0.3);
        }

        .sp-nav-icon {
          font-size: 1.15rem;
          margin-right: 0.85rem;
          flex-shrink: 0;
          opacity: 0.85;
        }

        .sp-nav-item.active .sp-nav-icon {
          opacity: 1;
        }

        .sp-logout-btn {
          color: #F87171 !important;
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none !important;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0.6rem 0.8rem;
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .sp-logout-btn:hover {
          background: rgba(248, 113, 113, 0.1) !important;
          color: #EF4444 !important;
        }

        /* Ajuste de margen para el contenedor de las páginas */
        @media (min-width: 992px) {
          .main-content {
            margin-left: 260px;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;