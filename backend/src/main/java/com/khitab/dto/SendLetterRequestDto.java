package com.khitab.dto;

import jakarta.validation.constraints.NotBlank;

public class SendLetterRequestDto {
    
    @NotBlank(message = "Letter content cannot be empty")
    private String content;

    @NotBlank(message = "Recipient ID is required")
    private String recipientId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }
}
