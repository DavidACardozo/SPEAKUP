import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import Registro from "./Pages/Registro";
import Login from "./Pages/Login";
import Modulos from "./Pages/Modulos";
import Perfil from "./Pages/Perfil";
import Inicio from "./Pages/Inicio";
import Historial from "./Pages/Historial";
import AdminPanel from "./Pages/Admin/AdminPanel";
import AdminUsuarios from  "./Pages/Admin/AdminUsuarios"
import PracticaWords from "./Pages/PracticeWords"

import ProtectedRoute from "./Context/ProtectedRoute";
import { AuthProvider, useAuth } from "./Context/AuthContext"; 
import Layout from "./Components/Layout"; 
import PracticaIA from "./Pages/PracticeIA";


const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; 

  if (!user || user.tipo !== 'admin') {
    console.log("Acceso denegado: El usuario no tiene rol admin", user);
    return <Navigate to="/inicio" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* 2. Ruta de Admin Protegida por ROL */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              </ProtectedRoute>
            } 
          />
                   <Route 
            path="/usuarios" 
            element={
              <ProtectedRoute>
                <AdminRoute>
                   <AdminUsuarios />
                </AdminRoute>
              </ProtectedRoute>
            } 
          />

          {/* 3. Rutas de Usuario Protegidas con Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/modulos" element={<Modulos />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/historial-quizes" element={<Historial />} />
            <Route path="/PracticeWithIA" element={<PracticaIA />} />
            <Route path="/PracticeWords" element={<PracticaWords />} />
          </Route>

          {/* Error 404 */}
          <Route
            path="*"
            element={
              <Container className="mt-5 text-center">
                <h2>Error 404: Página No Encontrada</h2>
                <p>Parece que te has perdido en el vocabulario.</p>
              </Container>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;