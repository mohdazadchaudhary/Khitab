package com.khitab.controller;

import com.khitab.dto.LetterDto;
import com.khitab.dto.SendLetterRequestDto;
import com.khitab.dto.SendLetterResponseDto;
import com.khitab.model.Letter;
import com.khitab.service.LetterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/letters")
public class LetterController {

    private final LetterService letterService;

    public LetterController(LetterService letterService) {
        this.letterService = letterService;
    }

    // POST /api/letters — Compose and send a letter
    @PostMapping
    public ResponseEntity<?> sendLetter(@Valid @RequestBody SendLetterRequestDto payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String senderId = (String) auth.getPrincipal();

            Letter letter = letterService.createAndSendLetter(senderId, payload.getRecipientId(), payload.getContent());

            return ResponseEntity.ok(new SendLetterResponseDto(
                "Your letter has been sealed and dispatched into the system.",
                letter.getId(),
                letter.getDeliverAt()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error sending letter: " + e.getMessage());
        }
    }

    // GET /api/letters/mailbox — Fetch letters addressed to this user (General)
    @GetMapping("/mailbox")
    public ResponseEntity<?> getMailbox() {
        return getLettersByStatus(null); // All
    }

    @GetMapping("/inbox")
    public ResponseEntity<?> getInbox() {
        return ResponseEntity.ok(letterService.getInbox(getCurrentUserId()));
    }

    @GetMapping("/sent")
    public ResponseEntity<?> getSent() {
        return ResponseEntity.ok(letterService.getSent(getCurrentUserId()));
    }

    @GetMapping("/in-transit")
    public ResponseEntity<?> getInTransit() {
        return ResponseEntity.ok(letterService.getInTransit(getCurrentUserId()));
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (String) auth.getPrincipal();
    }

    private ResponseEntity<?> getLettersByStatus(String status) {
        try {
            List<LetterDto> letters = letterService.getLettersForUserWithStatus(getCurrentUserId(), status);
            return ResponseEntity.ok(letters);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching letters.");
        }
    }
}

