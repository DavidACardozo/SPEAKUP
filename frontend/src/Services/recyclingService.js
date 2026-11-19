import clienteAxios from "../Api/axiosConfig";

const MATERIALS = [
  { value: "plastico", label: "Plástico", caneca: "Blanca", recomendacion: "Limpio y seco. Aplasta botellas y envases." },
  { value: "vidrio", label: "Vidrio", caneca: "Blanca", recomendacion: "Enjuágalo. Envuelve lo roto para evitar cortes." },
  { value: "papel", label: "Papel y cartón", caneca: "Blanca", recomendacion: "Seco y sin restos de comida." },
  { value: "metal", label: "Metal", caneca: "Blanca", recomendacion: "Enjuaga y aplasta las latas." },
  { value: "organico", label: "Orgánico", caneca: "Verde", recomendacion: "Cáscaras, frutas, verduras y restos de comida cruda." },
  { value: "no_aprovechable", label: "No aprovechable", caneca: "Negra", recomendacion: "Papel higiénico, servilletas usadas, comida preparada." },
];

const DEMO_RECICLAJE = {
  usuario: { nombre: "Ana García", codigo: "AN-4821" },
  puntos: [
    { id: 1, nombre: "Centro Verde", direccion: "Cra. 9 #15-40, Bogotá", horario: "Lun a sáb, 8:00 a 17:00", materiales: ["Plástico", "Vidrio", "Papel y cartón", "Metal"] },
    { id: 2, nombre: "Norte Recicla", direccion: "Calle 85 #12-20, Bogotá", horario: "Lun a sáb, 7:30 a 16:30", materiales: ["Orgánico", "Plástico", "Papel y cartón"] },
    { id: 3, nombre: "Sur Eco", direccion: "Av. 68 #20-10, Bogotá", horario: "Lun a dom, 9:00 a 18:00", materiales: ["Vidrio", "Metal", "Orgánico"] },
  ],
  historial: [
    { id: 1, punto: "Centro Verde", material: "Plástico", peso: 2.4, fecha: "2026-11-13T09:15:00" },
    { id: 2, punto: "Norte Recicla", material: "Papel y cartón", peso: 3.1, fecha: "2026-11-11T10:40:00" },
    { id: 3, punto: "Sur Eco", material: "Vidrio", peso: 1.8, fecha: "2026-11-08T15:20:00" },
    { id: 4, punto: "Centro Verde", material: "Metal", peso: 1.2, fecha: "2026-11-05T08:30:00" },
    { id: 5, punto: "Norte Recicla", material: "Plástico", peso: 4.6, fecha: "2026-11-03T12:10:00" },
  ],
  resumen: {
    totalKg: 28.4,
    entregas: 9,
    materialPrincipal: "Plástico",
    ultimaEntrega: "Centro Verde",
    kilosPorMaterial: {
      plastico: 12.5,
      vidrio: 5.2,
      papel: 7.1,
      metal: 2.4,
      organico: 1.2,
      no_aprovechable: 0,
    },
    codigo: "AN-4821",
  },
};

const RECICLAGE_SUMMARY = DEMO_RECICLAJE.resumen;
const HISTORIAL = DEMO_RECICLAJE.historial;
const PUNTOS = DEMO_RECICLAJE.puntos;

const getMaterialConfig = (material) => MATERIALS.find((item) => item.value === material) || MATERIALS[0];

export const recyclingService = {
  async getResumenUsuario() {
    return { ...RECICLAGE_SUMMARY, kilosPorMaterial: { ...RECICLAGE_SUMMARY.kilosPorMaterial } };
  },
  async getHistorial(material = "Todos") {
    const list = material === "Todos" ? HISTORIAL : HISTORIAL.filter((item) => item.material === material);
    return list.map((item) => ({ ...item, fecha: new Date(item.fecha).toISOString() }));
  },
  async getPuntosAliados() {
    return [...PUNTOS];
  },
  async detectarMaterialDesdeFoto(file) {
    if (!file) throw new Error("Debes adjuntar una foto.");

    const formData = new FormData();
    formData.append("file", file);

    const { data } = await clienteAxios.post("/reciclaje/classify", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });

    if (!data?.material) throw new Error(data?.error || "No pudimos clasificar la imagen.");
    return data;
  },
  async proyectarReciclaje(valoresHistoricos, pasosFuturos = 1) {
    const { data } = await clienteAxios.post("/reciclaje/regresion-lineal/proyeccion", {
      valoresHistoricos,
      pasosFuturos,
    });
    return data;
  },
  async getCanecaSuggestion(material) {
    const config = getMaterialConfig(material);
    return {
      material: config.label,
      caneca: config.caneca,
      recomendacion: config.recomendacion,
      nota: "Es una sugerencia, no una identificación exacta del objeto.",
      mensaje: `Parece un material: ${config.label}`,
      source: "mock",
    };
  },
  async getAliadoDashboard() {
    return {
      usuario: "Ana García",
      punto: "Centro Verde",
      ultimosRegistros: [
        { usuario: "AN-4821", material: "Plástico", kg: 2.4 },
        { usuario: "AR-9430", material: "Vidrio", kg: 1.6 },
        { usuario: "MT-1182", material: "Metal", kg: 1.1 },
      ],
    };
  },
};

export { MATERIALS };
