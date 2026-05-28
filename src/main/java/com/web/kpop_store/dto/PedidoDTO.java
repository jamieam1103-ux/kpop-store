package com.web.kpop_store.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PedidoDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private LocalDateTime fecha;
    private String estado;
    private Double total;
    private List<DetallePedidoDTO> detalles;
}