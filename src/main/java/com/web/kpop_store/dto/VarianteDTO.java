package com.web.kpop_store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class VarianteDTO {

    private Long id;

    private String descripcion; // "Talla M", "Color rojo"

    @NotNull @Positive
    private Double precio;

    @NotNull @Min(0)
    private Integer stock;

    @Min(0)
    private Integer stockMinimo;

    private Long productoId; // referencia al producto padre
}