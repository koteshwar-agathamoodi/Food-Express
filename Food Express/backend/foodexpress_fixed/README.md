# FoodExpress - Food Delivery Application

FoodExpress is a complete full-stack backend application built with Spring Boot, providing a platform for Customers to order food, Restaurant Owners to manage menus, and Delivery Agents to handle deliveries.

## Features

-   **Role-Based Access Control (RBAC)**: Supports Admin, Owner, Customer, and Delivery Agent.
-   **Security**: JWT-based stateless authentication.
-   **Restaurant Management**: Owners can create restaurants and manage menu items.
-   **Ordering System**: Customers can browse restaurants, manages a cart, and place orders.
-   **Delivery Tracking**: Agents can accept available orders and complete deliveries.
-   **Earnings & Payouts**: Tracking earnings for delivery agents per delivery.
-   **Review System**: Customers can rate and review their orders.

## Prerequisites

-   Java 17 or higher
-   Maven 3.6+
-   MySQL Server 8.0+

## Installation

1.  **Clone or Download** the project.
2.  **Database Setup**:
    -   Create a database named `food_delivery_db` in MySQL.
    -   Ensure your root password matches the one in `src/main/resources/application.properties`.
3.  **Build the Project**:
    