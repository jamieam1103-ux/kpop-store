package com.web.kpop_store.controller;

import com.web.kpop_store.repository.DetallePedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final DetallePedidoRepository detallePedidoRepository;

    @GetMapping("/top-productos")
    public ResponseEntity<List<Object[]>> topProductos() {
        return ResponseEntity.ok(detallePedidoRepository.findTopProductos());
    }

    @GetMapping("/ventas-mes")
    public ResponseEntity<Double> ventasMes() {
        LocalDateTime desde = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        Double total = detallePedidoRepository.sumVentasDesde(desde);
        return ResponseEntity.ok(total == null ? 0.0 : total);
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<Object[]>> stockBajo() {
        return ResponseEntity.ok(detallePedidoRepository.findTopProductos());
    }
}