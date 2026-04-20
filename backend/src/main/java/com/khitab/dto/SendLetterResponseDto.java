package com.khitab.dto;

public class SendLetterResponseDto {
    private String message;
    private String letterId;
    private long deliverAt;

    public SendLetterResponseDto(String message, String letterId, long deliverAt) {
        this.message = message;
        this.letterId = letterId;
        this.deliverAt = deliverAt;
    }

    public String getMessage() { return message; }
    public String getLetterId() { return letterId; }
    public long getDeliverAt() { return deliverAt; }
}
