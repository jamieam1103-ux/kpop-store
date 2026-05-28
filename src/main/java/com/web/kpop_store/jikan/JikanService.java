package com.web.kpop_store.jikan;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class JikanService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BASE_URL = "https://api.jikan.moe/v4";

    // Buscar anime por nombre
    public Map buscarAnime(String nombre) {
        String url = BASE_URL + "/anime?q=" + nombre + "&limit=1";
        return restTemplate.getForObject(url, Map.class);
    }

    // Buscar manga por nombre
    public Map buscarManga(String nombre) {
        String url = BASE_URL + "/manga?q=" + nombre + "&limit=1";
        return restTemplate.getForObject(url, Map.class);
    }
}