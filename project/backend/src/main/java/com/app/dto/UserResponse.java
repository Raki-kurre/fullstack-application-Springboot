package com.app.dto;

import com.app.entity.Role;
import com.app.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String provider;
    private String imageUrl;
    private LocalDateTime createdAt;

    /** Factory method to map User entity → UserResponse DTO */
    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .imageUrl(user.getImageUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
