package com.fooddeliveryapp.foodexpress.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String instructions;
}
