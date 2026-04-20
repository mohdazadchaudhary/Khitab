package com.khitab.repository;

import com.khitab.model.Letter;
import java.util.List;

public interface LetterRepository {
    void save(Letter letter) throws Exception;
    List<Letter> findByReceiverId(String receiverId) throws Exception;
    List<Letter> findBySenderId(String senderId) throws Exception;
    List<Letter> findInTransit() throws Exception;
    void updateStatus(String letterId, String status) throws Exception;
}
