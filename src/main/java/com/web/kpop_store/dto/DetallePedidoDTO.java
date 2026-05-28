package com.web.kpop_store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DetallePedidoDTO {
    private Long id;

    @NotNull
    private Long varianteId;

    private String varianteDescripcion;

    @NotNull @Min(1)
    private Integer cantidad;

    private Double precioUnitario;
}