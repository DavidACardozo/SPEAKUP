import React, { useState } from "react";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBars } from "react-icons/fa";


const Sidebar = ({ 
  menuItems = [], 
  brand = { name: "App", logo: "🚀" }, 
  onLogout 
}) => {
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

  const sidebarStyle = {
    background: "linear-gradient(180deg, #E1F5FE 0%, #B3E5FC 100%)",
    color: "#0277BD",
    minHeight: "100vh",
    boxShadow: "4px 0 15px rgba(0,0,0,0.05)",
  };

  const linkStyle = {
    color: "#01579B",
    fontWeight: "500",
    padding: "10px 15px", 
    borderRadius: "12px",
    margin: "4px 0",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    textDecoration: "none",
  };

  const activeLinkStyle = {
    ...linkStyle,
    background: "#FFFFFF",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    fontWeight: "700",
  };

  const MenuContent = () => (
    <div className="d-flex flex-column h-100">
      <div className="p-3 text-center flex-shrink-0">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
          <span style={{ fontSize: "2rem" }}>{brand.logo}</span>
          <h3 className="m-0 fw-bold" style={{ color: "#01579B" }}>
            {brand.name}
          </h3>
        </div>
        <hr style={{ borderColor: "#81D4FA" }} />
      </div>

      <Nav className="flex-column px-3 flex-grow-1" style={{ overflowY: "auto" }} onClick={handleClose}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.Icon; // Referencia al componente de icono

          return (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              style={isActive ? activeLinkStyle : linkStyle}
            >
              {Icon && <Icon className="me-3" />} {item.name}
            </Nav.Link>
          );
        })}
      </Nav>

      {onLogout && (
        <div className="p-4 flex-shrink-0">
          <Button
            variant="link"
            onClick={handleInternalLogout}
            style={{ ...linkStyle, color: "#D32F2F", width: "100%" }}
          >
            <FaSignOutAlt className="me-1" /> Cerrar Sesión
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="d-lg-none position-fixed p-3" style={{ zIndex: 1050, top: 0, left: 0 }}>
        <Button variant="light" onClick={handleShow} style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <FaBars color="#0277BD" />
        </Button>
      </div>

      <div className="d-none d-lg-block" style={{ width: "280px", position: "fixed", left: 0, top: 0, zIndex: 1000, ...sidebarStyle }}>
        <MenuContent />
      </div>
      <Offcanvas show={show} onHide={handleClose} placement="start" style={{ ...sidebarStyle, width: "280px" }}>
        <Offcanvas.Header closeButton />
        <Offcanvas.Body className="p-0">
          <MenuContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;