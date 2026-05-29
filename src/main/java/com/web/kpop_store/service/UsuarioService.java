package com.web.kpop_store.service;

import com.web.kpop_store.entity.Rol;
import com.web.kpop_store.entity.Usuario;
import com.web.kpop_store.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrar(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol(Rol.CLIENTE);
        usuario.setActivo(true);
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarTodos() { return usuarioRepository.findAll(); }

    public Usuario toggleActivo(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(!usuario.isActivo());
        return usuarioRepository.save(usuario);
    }
}