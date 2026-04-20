package com.khitab.repository;

import com.khitab.model.UserProfile;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    void save(UserProfile user);
    Optional<UserProfile> findById(String uid);
    List<UserProfile> findAll();
    List<UserProfile> findByInterests(List<String> interests);
}
