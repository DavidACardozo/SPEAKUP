import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Verificando sesión...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // NUEVA LÓGICA: Si la ruta es solo para admin y el usuario no es admin
  // Nota: Usamos res.tipo porque así lo envía tu backend según Postman
  if (adminOnly && user.tipo !== 'admin') {
    return <Navigate to="/inicio" replace />; // O a tu dashboard de usuario
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;