package com.web.kpop_store.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.kpop_store.repository.DetallePedidoRepository;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @org.springframework.beans.factory.annotation.Autowired
    private DetallePedidoRepository detallePedidoRepository;

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