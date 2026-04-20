package com.khitab.repository;

import com.google.cloud.firestore.*;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import com.khitab.model.Letter;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class FirestoreLetterRepositoryImpl implements LetterRepository {

    private static final String COLLECTION = "letters";

    private Firestore getDb() {
        return FirestoreClient.getFirestore();
    }

    @Override
    public void save(Letter letter) throws Exception {
        getDb().collection(COLLECTION).document(letter.getId()).set(letter).get();
    }

    @Override
    public List<Letter> findByReceiverId(String receiverId) throws Exception {
        QuerySnapshot snapshot = getDb().collection(COLLECTION)
                .whereEqualTo("receiverId", receiverId)
                .get().get();
        return snapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Letter.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<Letter> findBySenderId(String senderId) throws Exception {
        QuerySnapshot snapshot = getDb().collection(COLLECTION)
                .whereEqualTo("senderId", senderId)
                .get().get();
        return snapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Letter.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<Letter> findInTransit() throws Exception {
        QuerySnapshot snapshot = getDb().collection(COLLECTION)
                .whereEqualTo("status", "TRANSIT")
                .get().get();
        return snapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Letter.class))
                .collect(Collectors.toList());
    }

    @Override
    public void updateStatus(String letterId, String status) throws Exception {
        getDb().collection(COLLECTION).document(letterId).update("status", status).get();
    }
}

