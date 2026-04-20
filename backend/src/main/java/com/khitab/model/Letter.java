package com.khitab.model;

import java.time.Instant;

public class Letter {
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private long sentAt;
    private long deliverAt;
    private String status; // "TRANSIT", "DELIVERED"

    public Letter() {
        // Document deserialization requires default constructor
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public long getSentAt() { return sentAt; }
    public void setSentAt(long sentAt) { this.sentAt = sentAt; }

    public long getDeliverAt() { return deliverAt; }
    public void setDeliverAt(long deliverAt) { this.deliverAt = deliverAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
