package com.khitab.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.khitab.model.UserProfile;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class FirestoreUserRepositoryImpl implements UserRepository {

    private static final String COLLECTION = "users";

    @Override
    public void save(UserProfile user) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION).document(user.getUid()).set(user);
    }

    @Override
    public Optional<UserProfile> findById(String uid) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            DocumentReference docRef = db.collection(COLLECTION).document(uid);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                return Optional.ofNullable(document.toObject(UserProfile.class));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public List<UserProfile> findAll() {
        List<UserProfile> users = new ArrayList<>();
        try {
            Firestore db = FirestoreClient.getFirestore();
            ApiFuture<QuerySnapshot> future = db.collection(COLLECTION).get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                users.add(document.toObject(UserProfile.class));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return users;
    }

    @Override
    public List<UserProfile> findByInterests(List<String> interests) {
        // Simple mock-up: In reality, we'd use array_contains_any if possible
        // but Firestore has limits on that. For v1, we filter globally.
        return findAll().stream()
                .filter(u -> u.getInterests() != null && u.getInterests().stream().anyMatch(interests::contains))
                .toList();
    }
}
