package com.example.PAI.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.PAI.dto.response.CategoriaDesbloqueadaResponseDTO;
import com.example.PAI.dto.response.VocabularioInfoDTO;
import com.example.PAI.modelo.*;
import com.example.PAI.repository.CategoriaRepository;
import com.example.PAI.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioCategoriaService {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;

    public List<CategoriaDesbloqueadaResponseDTO> listarCategoriasDesbloqueadas(String usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return usuario.getCategorias().stream()
                .filter(UsuarioCategoria::isDesbloqueada)
                .map(uc -> {
                    Categoria c = categoriaRepository.findById(uc.getCategoriaId())
                            .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + uc.getCategoriaId()));

                    List<VocabularioInfoDTO> vocabularioDTO = c.getVocabularios().stream()
                            .map(v -> {
                                VocabularioInfoDTO dto = new VocabularioInfoDTO();
                                dto.setId(v.getId());
                                dto.setPalabraIngles(v.getPalabraIngles());
                                dto.setPalabraEspanol(v.getPalabraEspanol());
                                dto.setPronunciacion(v.getPronunciacion());
                                return dto;
                            })
                            .collect(Collectors.toList());

                    boolean completada = usuario.getIntentos().stream()
                            .anyMatch(intento ->
                                intento.getQuizId() != null &&
                                intento.getQuizId().equals(c.getQuizId()) &&
                                intento.getPuntaje() >= 70
                            );

                    return new CategoriaDesbloqueadaResponseDTO(
                            c.getId(),
                            c.getNombre(),
                            c.getDescripcion(),
                            c.getNivel(),
                            c.getQuizId(),
                            vocabularioDTO,
                            completada);
                })
                .collect(Collectors.toList());
    }

    public void asignarCategoriaInicial(Usuario usuario, Categoria categoriaInicial) {
        UsuarioCategoria uc = new UsuarioCategoria();
        uc.setCategoriaId(categoriaInicial.getId());
        uc.setCategoriaNombre(categoriaInicial.getNombre());
        uc.setCategoriaNivel(categoriaInicial.getNivel());
        uc.setDesbloqueada(true);
        usuario.getCategorias().add(uc);
        usuarioRepository.save(usuario);
    }

    public void desbloquearCategoria(Usuario usuario, Categoria categoria) {
        java.util.Optional<UsuarioCategoria> ucOpt = usuario.getCategorias().stream()
                .filter(uc -> uc.getCategoriaId().equals(categoria.getId()))
                .findFirst();

        if (ucOpt.isPresent()) {
            UsuarioCategoria uc = ucOpt.get();
            if (!uc.isDesbloqueada()) {
                uc.setDesbloqueada(true);
                usuarioRepository.save(usuario);
            }
        } else {
            UsuarioCategoria nueva = new UsuarioCategoria();
            nueva.setCategoriaId(categoria.getId());
            nueva.setCategoriaNombre(categoria.getNombre());
            nueva.setCategoriaNivel(categoria.getNivel());
            nueva.setDesbloqueada(true);
            usuario.getCategorias().add(nueva);
            usuarioRepository.save(usuario);
        }
    }
}