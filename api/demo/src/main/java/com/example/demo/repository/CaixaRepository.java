package com.example.demo.repository;

import com.example.demo.entity.funcionario.Caixa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaixaRepository extends JpaRepository<Caixa, Long> {
}
