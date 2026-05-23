package com.web.kpop_store.controller;

import com.web.kpop_store.entity.Usuario;
import com.web.kpop_store.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Usuario> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.toggleActivo(id));
    }
}