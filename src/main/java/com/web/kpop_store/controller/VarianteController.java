package com.web.kpop_store.controller;

import com.web.kpop_store.entity.Variante;
import com.web.kpop_store.repository.VarianteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/variantes")
public class VarianteController {

    private final VarianteRepository varianteRepository;

    public VarianteController(VarianteRepository varianteRepository) {
        this.varianteRepository = varianteRepository;
    }

    @PostMapping
    public ResponseEntity<Variante> crear(@RequestBody Variante variante) {
        return ResponseEntity.ok(varianteRepository.save(variante));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Variante> actualizar(@PathVariable Long id,
                                               @RequestBody Variante variante) {
        variante.setId(id);
        return ResponseEntity.ok(varianteRepository.save(variante));
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<Variante>> stockBajo() {
        return ResponseEntity.ok(varianteRepository.findVariantesConStockBajo());
    }
}