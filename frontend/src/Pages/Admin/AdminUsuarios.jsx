import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import clienteAxios from "../../Api/axiosConfig";
import { useAuth } from "../../Context/AuthContext";
import { Container } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import { FaCog, FaUserCog } from "react-icons/fa";

const AdminPanel = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("categorias");


  // Configuración para el Sidebar dinámico
  const userMenu = [
    { name: "Gestionar categorias", path: "/admin", Icon: FaCog },
    { name: "Gestionar usuarios", path: "/usuarios", Icon: FaUserCog },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        menuItems={userMenu}
        brand={{ name: "SpeakUp! W&B", logo: "🦉" }}
        onLogout={logout}
      />
      
      <div
        className="container-fluid"
        style={{ 
          background: "#f0f7ff", 
          minHeight: "100vh",
          paddingLeft: "280px", // Espacio para el Sidebar fijo en desktop
          transition: "all 0.3s"
        }}
      >
        <div className="row">
          <div className="col-12 p-4 text-center">
            <h1 className="fw-bold d-inline-block" style={{ color: "#01579B" }}>Gestionar usuarios</h1>
          </div>
        </div>
      </div>
    </div>
  );
  };

export default AdminPanel;