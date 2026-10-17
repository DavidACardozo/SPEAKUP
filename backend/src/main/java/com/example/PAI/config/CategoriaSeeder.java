package com.example.PAI.config;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.PAI.dto.request.CrearCategoriaDTO;
import com.example.PAI.dto.response.VocabularioDTO;
import com.example.PAI.repository.CategoriaRepository;
import com.example.PAI.services.CategoriaService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// =========================================================
// 🔥 CREA LAS CATEGORÍAS BASE AL ARRANCAR SI NO EXISTEN
// =========================================================
// Se buscan por nombre, así que no duplica las que ya estén
// en la base. Cada una se crea con sus 3 quizzes a través de
// CategoriaService, igual que desde el panel de admin.
@Slf4j
@Component
@RequiredArgsConstructor
public class CategoriaSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaService categoriaService;

    @Override
    public void run(String... args) {

        for (Map.Entry<String, CrearCategoriaDTO> entry : categoriasBase().entrySet()) {

            if (categoriaRepository.existsByNombreIgnoreCase(entry.getKey())) {
                continue;
            }

            categoriaService.crearCategoria(entry.getValue());
            log.info("Categoría creada: {}", entry.getKey());
        }
    }

    private Map<String, CrearCategoriaDTO> categoriasBase() {

        Map<String, CrearCategoriaDTO> categorias = new LinkedHashMap<>();

        agregar(categorias, "Colores", "Aprende los colores en ingles",
                v("Red", "Rojo", "red"),
                v("Blue", "Azul", "blu"),
                v("Green", "Verde", "grin"),
                v("Yellow", "Amarillo", "lélou"),
                v("Black", "Negro", "blak"),
                v("White", "Blanco", "uáit"));

        agregar(categorias, "Animales", "Vocabulario de animales en ingles",
                v("Dog", "Perro", "dog"),
                v("Cat", "Gato", "kat"),
                v("Horse", "Caballo", "jors"),
                v("Bird", "Pájaro", "berd"),
                v("Fish", "Pez", "fish"),
                v("Lion", "León", "láion"));

        agregar(categorias, "Comida", "Vocabulario de alimentos en ingles",
                v("Bread", "Pan", "bred"),
                v("Milk", "Leche", "milk"),
                v("Rice", "Arroz", "ráis"),
                v("Meat", "Carne", "mit"),
                v("Cheese", "Queso", "chiz"),
                v("Egg", "Huevo", "eg"));

        agregar(categorias, "Ropa", "Vocabulario de prendas de vestir en ingles",
                v("Shirt", "Camisa", "shert"),
                v("Pants", "Pantalón", "pants"),
                v("Shoes", "Zapatos", "shus"),
                v("Hat", "Sombrero", "jat"),
                v("Jacket", "Chaqueta", "yáket"),
                v("Socks", "Medias", "soks"));

        agregar(categorias, "Numeros", "Aprende a contar en ingles",
                v("One", "Uno", "uán"),
                v("Two", "Dos", "tu"),
                v("Three", "Tres", "zri"),
                v("Four", "Cuatro", "for"),
                v("Five", "Cinco", "fáiv"),
                v("Six", "Seis", "six"));

        agregar(categorias, "Partes del Cuerpo", "Vocabulario del cuerpo humano en ingles",
                v("Head", "Cabeza", "jed"),
                v("Hand", "Mano", "jand"),
                v("Foot", "Pie", "fut"),
                v("Eye", "Ojo", "ái"),
                v("Ear", "Oreja", "íer"),
                v("Arm", "Brazo", "arm"));

        agregar(categorias, "Deportes", "Vocabulario de deportes en ingles",
                v("Soccer", "Fútbol", "sóker"),
                v("Basketball", "Baloncesto", "básketbol"),
                v("Tennis", "Tenis", "ténis"),
                v("Swimming", "Natación", "suíming"),
                v("Boxing", "Boxeo", "bóksing"),
                v("Running", "Correr", "róning"));

        agregar(categorias, "Profesiones", "Vocabulario de profesiones y oficios en ingles",
                v("Doctor", "Médico", "dóktor"),
                v("Teacher", "Profesor", "tícher"),
                v("Engineer", "Ingeniero", "enyinír"),
                v("Lawyer", "Abogado", "lóyer"),
                v("Nurse", "Enfermera", "ners"),
                v("Chef", "Cocinero", "shef"));

        agregar(categorias, "Clima", "Vocabulario del clima en ingles",
                v("Sun", "Sol", "san"),
                v("Rain", "Lluvia", "réin"),
                v("Wind", "Viento", "uínd"),
                v("Snow", "Nieve", "snóu"),
                v("Cloud", "Nube", "cláud"),
                v("Storm", "Tormenta", "storm"));

        agregar(categorias, "Muebles", "Vocabulario de muebles de la casa en ingles",
                v("Table", "Mesa", "téibol"),
                v("Chair", "Silla", "cher"),
                v("Bed", "Cama", "bed"),
                v("Sofa", "Sofá", "sóufa"),
                v("Lamp", "Lámpara", "lamp"),
                v("Shelf", "Estante", "shelf"));

        return categorias;
    }

    private void agregar(Map<String, CrearCategoriaDTO> categorias,
            String nombre, String descripcion, VocabularioDTO... vocabularios) {

        List<VocabularioDTO> lista = Arrays.asList(vocabularios);
        categorias.put(nombre, new CrearCategoriaDTO(nombre, descripcion, lista));
    }

    private VocabularioDTO v(String ingles, String espanol, String pronunciacion) {
        return new VocabularioDTO(null, ingles, espanol, pronunciacion);
    }
}
