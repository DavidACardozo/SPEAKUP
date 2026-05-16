import axios from 'axios';

// 1. Configuramos la URL base de tu backend de Spring Boot
const clienteAxios = axios.create({
    baseURL: 'http://localhost:8083/api'
});

// 2. El Interceptor: Este código se ejecuta ANTES de cada petición
clienteAxios.interceptors.request.use(
    (config) => {
        // Sacamos el token que guardamos en el Login
        const token = localStorage.getItem('token');
        
        if (token) {
            // Lo pegamos en la cabecera "Authorization"
            // Spring Security espera: "Bearer <token>"
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default clienteAxios;