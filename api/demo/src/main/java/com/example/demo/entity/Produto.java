package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Entity
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long produto_id;

    private String nome;

    private String marca;

    // private List<Categoria> categorias;

    // unidade_de_media

    private BigDecimal valor_de_compra;

    private BigDecimal precoUnitario;

    private BigDecimal desconto = BigDecimal.ZERO;

    private Integer quantidadeEstoque;

    @Column(unique = true)
    private String codigoBarras;



}