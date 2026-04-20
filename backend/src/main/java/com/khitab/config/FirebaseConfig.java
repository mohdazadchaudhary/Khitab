package com.khitab.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

import java.io.IOException;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder();
                
                // Try to load from serviceAccountKey.json in the current directory or resources
                try {
                    java.io.InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json");
                    if (serviceAccount == null) {
                        // Fallback to environment variable
                        optionsBuilder.setCredentials(GoogleCredentials.getApplicationDefault());
                    } else {
                        optionsBuilder.setCredentials(GoogleCredentials.fromStream(serviceAccount));
                    }
                } catch (Exception e) {
                    // Fallback to environment variable if direct file load fails
                    optionsBuilder.setCredentials(GoogleCredentials.getApplicationDefault());
                }

                FirebaseOptions options = optionsBuilder
                        .setDatabaseUrl("https://connects-azad-default-rtdb.firebaseio.com")
                        .build();

                FirebaseApp.initializeApp(options);
                log.info("Firebase initialized successfully.");
            }
        } catch (IOException e) {
            log.error("Firebase initialization failed: {}", e.getMessage());
        }
    }
}
