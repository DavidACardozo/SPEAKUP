import clienteAxios from "../Api/axiosConfig";

// La llamada a la IA la hace el backend (POST /api/ia/gap-fill),
// así la clave de la IA nunca llega al navegador.
export const generarParrafoIA = async (categoria, palabrasClave) => {
  try {
    // Espera hasta 2 minutos: el backend puede reintentar varias veces con la IA.
    const { data } = await clienteAxios.post(
      "/ia/gap-fill",
      { categoria, palabras: palabrasClave },
      { timeout: 120000 }
    );

    if (!data?.texto || !Array.isArray(data?.soluciones)) {
      throw new Error("Respuesta de IA incompleta");
    }
    return data;
  } catch (error) {
    console.error("Error en generarParrafoIA:", error.message);
    throw error;
  }
};
