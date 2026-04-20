package com.khitab.dto;

public class LetterDto {
    private String id;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String receiverName;
    private String content;
    private long sentAt;
    private long deliverAt;
    private String status;
    private double senderLat;
    private double senderLon;
    private String senderCity;
    private String senderCountry;
    private double receiverLat;
    private double receiverLon;
    private String receiverCity;
    private String receiverCountry;

    public LetterDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public long getSentAt() { return sentAt; }
    public void setSentAt(long sentAt) { this.sentAt = sentAt; }

    public long getDeliverAt() { return deliverAt; }
    public void setDeliverAt(long deliverAt) { this.deliverAt = deliverAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getSenderLat() { return senderLat; }
    public void setSenderLat(double senderLat) { this.senderLat = senderLat; }

    public double getSenderLon() { return senderLon; }
    public void setSenderLon(double senderLon) { this.senderLon = senderLon; }

    public String getSenderCity() { return senderCity; }
    public void setSenderCity(String senderCity) { this.senderCity = senderCity; }

    public String getSenderCountry() { return senderCountry; }
    public void setSenderCountry(String senderCountry) { this.senderCountry = senderCountry; }

    public double getReceiverLat() { return receiverLat; }
    public void setReceiverLat(double receiverLat) { this.receiverLat = receiverLat; }

    public double getReceiverLon() { return receiverLon; }
    public void setReceiverLon(double receiverLon) { this.receiverLon = receiverLon; }

    public String getReceiverCity() { return receiverCity; }
    public void setReceiverCity(String receiverCity) { this.receiverCity = receiverCity; }

    public String getReceiverCountry() { return receiverCountry; }
    public void setReceiverCountry(String receiverCountry) { this.receiverCountry = receiverCountry; }
}
