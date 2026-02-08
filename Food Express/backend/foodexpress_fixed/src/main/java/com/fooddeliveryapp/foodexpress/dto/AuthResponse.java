package com.fooddeliveryapp.foodexpress.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    @NotBlank(message = "Token must not be blank")
    private String token;

    @NotBlank(message = "Role must not be blank")
    private String role;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email must not be blank")
    private String email;

    private String name;
}
