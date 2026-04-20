package com.khitab.controller;

import com.khitab.model.UserProfile;
import com.khitab.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/explore")
public class ExploreController {

    private final UserRepository userRepository;

    public ExploreController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfile>> getUsers(@RequestParam(required = false) String country) {
        List<UserProfile> allUsers = userRepository.findAll();
        if (country != null && !country.isEmpty()) {
            return ResponseEntity.ok(allUsers.stream()
                    .filter(u -> country.equalsIgnoreCase("Global") || country.equalsIgnoreCase(u.getEmail())) // Mocking country check via email for now if no country field exists
                    .toList());
        }
        return ResponseEntity.ok(allUsers);
    }

    @GetMapping("/map-data")
    public ResponseEntity<Map<String, Long>> getMapData() {
        List<UserProfile> allUsers = userRepository.findAll();
        // Mocking country mapping. In reality, UserProfile should have a country field.
        // For now, we'll just return a count by a dummy key or email domain.
        Map<String, Long> density = allUsers.stream()
                .collect(Collectors.groupingBy(u -> "Unknown", Collectors.counting()));
        return ResponseEntity.ok(density);
    }
}
