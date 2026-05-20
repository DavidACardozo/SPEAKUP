package com.example.PAI.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.PAI.modelo.Categoria;

@Repository
public interface CategoriaRepository extends MongoRepository<Categoria, String> {

    Optional<Categoria> findFirstByOrderByNivelDesc();

    // Busca la categoria que contiene este quiz dentro de su lista de quizzes.
    @Query("{ 'quizIds': ?0 }")
    Optional<Categoria> findByQuizId(String quizId);

    Optional<Categoria> findByNivel(int nivel);
}
