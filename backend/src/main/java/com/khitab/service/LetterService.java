package com.khitab.service;

import com.khitab.dto.LetterDto;
import com.khitab.model.Letter;
import com.khitab.model.UserProfile;
import com.khitab.repository.LetterRepository;
import com.khitab.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LetterService {

    private final LetterRepository letterRepository;
    private final UserRepository userRepository;

    public LetterService(LetterRepository letterRepository, UserRepository userRepository) {
        this.letterRepository = letterRepository;
        this.userRepository = userRepository;
    }

    public Letter createAndSendLetter(String senderId, String recipientId, String content) throws Exception {
        UserProfile sender = userRepository.findById(senderId)
                .orElseThrow(() -> new Exception("Sender profile not found."));
        UserProfile recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new Exception("Recipient profile not found."));

        double distance = calculateDistance(sender.getLatitude(), sender.getLongitude(),
                recipient.getLatitude(), recipient.getLongitude());

        long deliveryDelay = calculateDeliveryDelay(distance);

        Letter letter = new Letter();
        letter.setId(UUID.randomUUID().toString());
        letter.setSenderId(senderId);
        letter.setReceiverId(recipientId);
        letter.setContent(content);
        letter.setStatus("TRANSIT");
        letter.setSentAt(Instant.now().toEpochMilli());
        letter.setDeliverAt(letter.getSentAt() + deliveryDelay);

        letterRepository.save(letter);
        return letter;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private long calculateDeliveryDelay(double distanceKm) {
        long baseDelayMs;
        if (distanceKm < 50) {
            baseDelayMs = 30 * 60 * 1000L; // 30 mins
        } else if (distanceKm < 500) {
            baseDelayMs = 2 * 60 * 60 * 1000L; // 2 hours
        } else if (distanceKm < 2000) {
            baseDelayMs = 6 * 60 * 60 * 1000L; // 6 hours
        } else if (distanceKm < 7000) {
            baseDelayMs = 24 * 60 * 60 * 1000L; // 1 day
        } else {
            baseDelayMs = 3 * 24 * 60 * 60 * 1000L; // 3 days
        }

        // Add 0-20% jitter
        double jitter = 1.0 + (Math.random() * 0.2);
        return (long) (baseDelayMs * jitter);
    }

    public List<LetterDto> getInbox(String userId) {
        try {
            return letterRepository.findByReceiverId(userId).stream()
                    .filter(l -> "DELIVERED".equals(l.getStatus()) || "READ".equals(l.getStatus()))
                    .map(this::toDto).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching inbox: " + e.getMessage(), e);
        }
    }

    public List<LetterDto> getSent(String userId) {
        try {
            return letterRepository.findBySenderId(userId).stream()
                    .map(this::toDto).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching sent letters: " + e.getMessage(), e);
        }
    }

    public List<LetterDto> getInTransit(String userId) {
        try {
            // In-Transit for user can be both incoming and outgoing
            List<Letter> incoming = letterRepository.findByReceiverId(userId).stream()
                    .filter(l -> "TRANSIT".equals(l.getStatus()))
                    .toList();
            List<Letter> outgoing = letterRepository.findBySenderId(userId).stream()
                    .filter(l -> "TRANSIT".equals(l.getStatus()))
                    .toList();

            List<Letter> all = new java.util.ArrayList<>();
            all.addAll(incoming);
            all.addAll(outgoing);
            return all.stream().map(this::toDto).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching in-transit letters: " + e.getMessage(), e);
        }
    }

    public List<LetterDto> getLettersForUserWithStatus(String userId, String status) {
        try {
            return letterRepository.findByReceiverId(userId).stream()
                    .filter(l -> status == null || status.equals(l.getStatus()))
                    .map(this::toDto).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching letters by status: " + e.getMessage(), e);
        }
    }

    private LetterDto toDto(Letter letter) {
        LetterDto dto = new LetterDto();
        dto.setId(letter.getId());
        dto.setSenderId(letter.getSenderId());
        dto.setReceiverId(letter.getReceiverId());
        dto.setContent(letter.getContent());
        dto.setSentAt(letter.getSentAt());
        dto.setDeliverAt(letter.getDeliverAt());
        dto.setStatus(letter.getStatus());

        // Hydrate with names and locations for tracking
        userRepository.findById(letter.getSenderId()).ifPresent(s -> {
            dto.setSenderName(s.getPenName());
            dto.setSenderLat(s.getLatitude());
            dto.setSenderLon(s.getLongitude());
            dto.setSenderCity(s.getCity());
            dto.setSenderCountry(s.getCountry());
        });
        userRepository.findById(letter.getReceiverId()).ifPresent(r -> {
            dto.setReceiverName(r.getPenName());
            dto.setReceiverLat(r.getLatitude());
            dto.setReceiverLon(r.getLongitude());
            dto.setReceiverCity(r.getCity());
            dto.setReceiverCountry(r.getCountry());
        });

        return dto;
    }
}
