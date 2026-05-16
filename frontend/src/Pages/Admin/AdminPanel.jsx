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
  const [mostrarFormularioAgregar, setMostrarFormularioAgregar] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    nivel: 1,
    vocabularios: [],
  });

  const [vocabTemp, setVocabTemp] = useState({
    palabraIngles: "",
    palabraEspanol: "",
    pronunciacion: "",
  });

  // Configuración para el Sidebar dinámico
  const userMenu = [
    { name: "Gestionar categorias", path: "/admin", Icon: FaCog },
    { name: "Gestionar usuarios", path: "/usuarios", Icon: FaUserCog },
  ];

  const agregarVocabulario = () => {
    if (!vocabTemp.palabraIngles || !vocabTemp.palabraEspanol || !vocabTemp.pronunciacion) {
      alert("Por favor, completa todos los campos del vocabulario.");
      return;
    }

    const nuevoVocabulario = {
      palabraIngles: vocabTemp.palabraIngles,
      palabraEspanol: vocabTemp.palabraEspanol,
      pronunciacion: vocabTemp.pronunciacion,
    };

    setFormData({
      ...formData,
      vocabularios: [...formData.vocabularios, nuevoVocabulario],
    });
    setVocabTemp({ palabraIngles: "", palabraEspanol: "", pronunciacion: "" });
  };

  const eliminarVocabulario = (index) => {
    const nuevaLista = [...formData.vocabularios];
    nuevaLista.splice(index, 1);
    setFormData({ ...formData, vocabularios: nuevaLista });
  };

  const guardarCategoriaNueva = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.descripcion) {
      alert("El nombre y la descripción son obligatorios.");
      return;
    }

    try {
      const response = await clienteAxios.post("/admin/categorias", formData);
      if (response.status === 200 || response.status === 201) {
        alert("¡Categoría y vocabularios guardados con éxito!");
        setFormData({ nombre: "", descripcion: "", nivel: 1, vocabularios: [] });
        setMostrarFormularioAgregar(false);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      const errorMsg = error.response?.data?.mensaje || "Error de conexión con el servidor.";
      alert(`No se pudo guardar: ${errorMsg}`);
    }
  };

  const renderForm = () => {
    return (
      <div className="card shadow-sm p-4 border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="m-0" style={{ color: "#0d6efd", fontWeight: "bold" }}>
            Gestión de {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h5>
        </div>

        {mostrarFormularioAgregar ? (
          <form onSubmit={guardarCategoriaNueva}>
            <div className="bg-light p-3 rounded mb-4">
              <h6>Información de la Categoría</h6>
              <div className="mb-3">
                <label className="form-label">Nombre de la Categoría</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Saludos Iniciales"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Describe qué aprenderá el estudiante..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="border p-3 rounded mb-4">
              <h6>Agregar Vocabulario</h6>
              <div className="row g-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Palabra en Inglés"
                    value={vocabTemp.palabraIngles}
                    onChange={(e) => setVocabTemp({ ...vocabTemp, palabraIngles: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Traducción al Español"
                    value={vocabTemp.palabraEspanol}
                    onChange={(e) => setVocabTemp({ ...vocabTemp, palabraEspanol: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pronunciación (Ej: /jelóu/)"
                    value={vocabTemp.pronunciacion}
                    onChange={(e) => setVocabTemp({ ...vocabTemp, pronunciacion: e.target.value })}
                  />
                </div>
                <div className="col-md-1">
                  <button type="button" className="btn btn-primary w-100" onClick={agregarVocabulario}>
                    +
                  </button>
                </div>
              </div>
            </div>

            {formData.vocabularios.length > 0 && (
              <div className="mb-4">
                <p className="fw-bold mb-2">Lista de palabras ({formData.vocabularios.length})</p>
                <ul className="list-group shadow-sm">
                  {formData.vocabularios.map((v, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <span className="text-primary fw-bold">{v.palabraIngles}</span>
                        <span className="text-muted mx-2">➔</span>
                        {v.palabraEspanol}
                        <small className="ms-2 text-secondary italic">({v.pronunciacion})</small>
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm border-0"
                        onClick={() => eliminarVocabulario(index)}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="d-flex gap-2 justify-content-end border-top pt-3">
              <button className="btn btn-secondary px-4" type="button" onClick={() => setMostrarFormularioAgregar(false)}>
                Cancelar
              </button>
              <button className="btn btn-success px-4" type="submit">
                Guardar
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No hay una acción seleccionada</p>
            <button className="btn btn-primary px-4 py-2 shadow" onClick={() => setMostrarFormularioAgregar(true)}>
              + Crear Nueva Categoría
            </button>
          </div>
        )}
      </div>
    );
  };

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
          <div className="col-12 p-4">
            <div className="container">{renderForm()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;