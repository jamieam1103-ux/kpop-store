package com.web.kpop_store.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductoDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    private String imagen;

    @NotBlank(message = "La categoría es obligatoria")
    private String categoria; // KPOP, ANIME
}