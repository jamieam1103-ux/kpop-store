package com.web.kpop_store.controller;

import com.web.kpop_store.jikan.JikanService;
import com.web.kpop_store.entity.Producto;
import com.web.kpop_store.entity.Variante;
import com.web.kpop_store.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;
    private final JikanService jikanService;

    public ProductoController(ProductoService productoService, JikanService jikanService) {
        this.productoService = productoService;
        this.jikanService = jikanService;
    }

    @GetMapping
    public List<Producto> listar() {
        return productoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) {
        return productoService.buscarPorId(id);
    }

    @GetMapping("/categoria/{categoria}")
    public List<Producto> porCategoria(@PathVariable String categoria) {
        return productoService.buscarPorCategoria(categoria);
    }

    @GetMapping("/buscar")
    public List<Producto> buscar(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Producto crear(@RequestBody Producto producto) {
        return productoService.guardar(producto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        return productoService.actualizar(id, producto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.ok("Producto eliminado");
    }

    @GetMapping("/jikan/anime")
    @PreAuthorize("hasRole('ADMIN')")
    public Map buscarAnime(@RequestParam String nombre) {
        return jikanService.buscarAnime(nombre);
    }

    @GetMapping("/jikan/manga")
    @PreAuthorize("hasRole('ADMIN')")
    public Map buscarManga(@RequestParam String nombre) {
        return jikanService.buscarManga(nombre);
    }

    @GetMapping("/stock-bajo")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Variante> stockBajo() {
        return productoService.stockBajo();
    }
}