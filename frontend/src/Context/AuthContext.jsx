import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Añadimos estado de carga

  useEffect(() => {
    // 1. Al cargar la app, recuperamos TODO de localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario");

    if (token && storedUser) {
      // Reconstruimos el estado completo: datos + token
      setUser({ ...JSON.parse(storedUser), token });
    }
    setLoading(false);
  }, []);

  const login = (usuarioData) => {
    // usuarioData ya debe traer el token y los datos del backend
    setUser(usuarioData); 
  };

  const logout = () => {
    // Limpieza total para seguridad
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuarioId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);