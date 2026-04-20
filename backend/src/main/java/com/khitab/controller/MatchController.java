package com.khitab.controller;

import com.khitab.model.UserProfile;
import com.khitab.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/match")
public class MatchController {

    private final UserRepository userRepository;

    public MatchController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserProfile>> getSuggestions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = (String) auth.getPrincipal();

        UserProfile currentUser = userRepository.findById(currentUserId).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.badRequest().build();
        }

        List<UserProfile> allUsers = userRepository.findAll();
        List<UserProfile> suggestions = allUsers.stream()
                .filter(u -> !u.getUid().equals(currentUserId))
                .sorted(Comparator.comparingInt(u -> -calculateMatchScore(currentUser, u)))
                .limit(5)
                .collect(Collectors.toList());

        return ResponseEntity.ok(suggestions);
    }

    private int calculateMatchScore(UserProfile u1, UserProfile u2) {
        if (u1.getInterests() == null || u2.getInterests() == null) return 0;
        
        long commonInterests = u1.getInterests().stream()
                .filter(u2.getInterests()::contains)
                .count();
        
        // Simple score: 10 points per common interest
        return (int) (commonInterests * 10);
    }
}
