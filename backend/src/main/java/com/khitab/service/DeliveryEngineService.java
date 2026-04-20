package com.khitab.service;

import com.khitab.model.Letter;
import com.khitab.repository.LetterRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * The heart of Khitab — the Time Delay Delivery Engine.
 *
 * This scheduled service wakes up every minute, finds letters whose
 * delivery time has elapsed, and marks them as DELIVERED in Firestore.
 */
@Service
public class DeliveryEngineService {

    private static final Logger log = LoggerFactory.getLogger(DeliveryEngineService.class);
    private final LetterRepository letterRepository;

    public DeliveryEngineService(LetterRepository letterRepository) {
        this.letterRepository = letterRepository;
    }

    // Runs every 60 seconds
    @Scheduled(fixedDelay = 60_000)
    public void processDeliveries() {
        log.info("[Khitab Engine] Checking for letters ready for delivery...");
        try {
            List<Letter> inTransit = letterRepository.findInTransit();
            long now = Instant.now().toEpochMilli();

            int deliveredCount = 0;
            for (Letter letter : inTransit) {
                if (letter.getDeliverAt() <= now) {
                    letterRepository.updateStatus(letter.getId(), "DELIVERED");
                    deliveredCount++;
                    log.info("[Khitab Engine] Letter {} delivered!", letter.getId());
                }
            }

            if (deliveredCount == 0) {
                log.info("[Khitab Engine] No letters ready yet. {} in transit.", inTransit.size());
            } else {
                log.info("[Khitab Engine] Delivered {} letter(s) this cycle.", deliveredCount);
            }

        } catch (Exception e) {
            log.error("[Khitab Engine] Error during delivery cycle", e);
        }
    }
}
