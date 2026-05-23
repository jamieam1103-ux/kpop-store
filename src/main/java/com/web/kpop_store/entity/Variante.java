package com.web.kpop_store.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "variantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Variante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion; // ej: "Talla M", "Color rojo"

    private Double precio;

    private Integer stock;

    private Integer stockMinimo;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;
}