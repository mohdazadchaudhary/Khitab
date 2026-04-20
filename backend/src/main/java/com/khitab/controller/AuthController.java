package com.khitab.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        // Here we extract the User ID verified by the FirebaseTokenFilter
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) authentication.getPrincipal();
        
        String displayName = payload.get("displayName");
        String email = payload.get("email");
        
        // TODO: Save this user to Firestore using the Firebase Admin SDK
        // For now, return a success response
        return ResponseEntity.ok(Map.of(
            "message", "User " + displayName + " successfully registered in Spring Boot DB.",
            "uid", uid
        ));
    }
}
