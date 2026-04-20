package com.khitab.model;

import java.util.List;

public class UserProfile {
    private String uid;
    private String penName;
    private double latitude;
    private double longitude;
    private String email;
    private String country;
    private String city;
    private List<String> interests;
    private String bio;
    private String avatarUrl;

    public UserProfile() {}

    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }

    public String getPenName() { return penName; }
    public void setPenName(String penName) { this.penName = penName; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
