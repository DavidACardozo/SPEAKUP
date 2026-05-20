package com.example.PAI.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.PAI.modelo.Quiz;

@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {

    List<Quiz> findByCategoriaId(String categoriaId);
}