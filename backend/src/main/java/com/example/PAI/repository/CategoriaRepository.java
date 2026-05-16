package com.example.PAI.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.PAI.modelo.Categoria;

@Repository
public interface CategoriaRepository extends MongoRepository<Categoria, String> {

    Optional<Categoria> findFirstByOrderByNivelDesc();

    // ✅ Corregido — quizId es campo directo en el documento
    @Query("{ 'quizId': ?0 }")
    Optional<Categoria> findByQuizId(String quizId);

    Optional<Categoria> findByNivel(int nivel);
}