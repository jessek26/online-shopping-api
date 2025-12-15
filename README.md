I am sorry about that\! It seems the file preview window isn't loading correctly for you.

Here is the **exact text** for your `README.md` file. You can copy and paste everything below the line into your file.

---

# Retail Store Management API

**Live Deployment:** [https://online-shopping-api-2w00.onrender.com](https://www.google.com/search?q=https://online-shopping-api-2w00.onrender.com)

## Project Overview

A robust RESTful API designed to streamline grocery store operations. It allows managers (Admins) to create and assign orders, while employees (Shoppers) can view their assigned tasks and manage inventory.

## Key Features

- **Secure Authentication:** User registration and login using BCrypt (hashing) and JWT (Tokens).
- **Role-Based Access Control (RBAC):** Strict permission separation between **Admins** and **Shoppers**.
- **Advanced Filtering:** Filter orders by status or delivery type.
- **Ownership Checks:** Shoppers can only modify orders assigned specifically to them.
- **Environment Aware:** Automatically switches between SQLite (Local) and PostgreSQL (Production).

## Technologies Used

- **Runtime:** Node.js & Express
- **Database:** PostgreSQL (Production) / SQLite (Local)
- **ORM:** Sequelize
- **Security:** JSON Web Tokens (JWT) & BCryptjs
- **Testing:** Jest & Supertest

---

## Authentication Guide

This API uses **Bearer Token Authentication**.

1.  **Login** via `POST /login` to receive a `token`.
2.  Include this token in the header of all protected requests:
    - **Key:** `Authorization`
    - **Value:** `YOUR_TOKEN_STRING`

### User Roles & Permissions

| Role        | Permissions                                                                                                         |
| :---------- | :------------------------------------------------------------------------------------------------------------------ |
| **Admin**   | Full access. Can create/delete orders, view all employees, and manage any order.                                    |
| **Shopper** | Restricted access. Can view assigned orders, update order status, and manage items. Cannot create or delete orders. |

### Default Test Credentials (from Seed)

- **Admin:** `mike@store.com` / `password123`
- **Shopper:** `sarah@store.com` / `password123`

---

## API Endpoints

### Authentication

| Method | Endpoint    | Access | Description                       |
| :----- | :---------- | :----- | :-------------------------------- |
| `POST` | `/register` | Public | Register a new user account.      |
| `POST` | `/login`    | Public | Login to receive an access token. |

### Orders

| Method   | Endpoint      | Access         | Description                                                              |
| :------- | :------------ | :------------- | :----------------------------------------------------------------------- |
| `GET`    | `/orders`     | Protected      | Fetch orders. Supports filters: `?status=pending` or `?isDelivery=true`. |
| `GET`    | `/orders/:id` | Protected      | Fetch details for a single order.                                        |
| `POST`   | `/orders`     | **Admin Only** | Create a new order.                                                      |
| `PATCH`  | `/orders/:id` | Owner/Admin    | Update status. Shoppers can only update _their_ orders.                  |
| `DELETE` | `/orders/:id` | **Admin Only** | Permanently remove an order.                                             |

### Items (Inventory)

| Method   | Endpoint     | Access    | Description                         |
| :------- | :----------- | :-------- | :---------------------------------- |
| `POST`   | `/items`     | Protected | Add an item to an order.            |
| `PATCH`  | `/items/:id` | Protected | Update item details (price, stock). |
| `DELETE` | `/items/:id` | Protected | Remove an item from an order.       |

### Employees

| Method | Endpoint     | Access         | Description                     |
| :----- | :----------- | :------------- | :------------------------------ |
| `GET`  | `/employees` | **Admin Only** | View list of all staff members. |

---

## Local Setup Instructions

1.  **Clone & Install:**

    ```bash
    git clone https://github.com/YOUR_USERNAME/online-shopping-api.git
    cd online-shopping-api
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file in the root folder:

    ```ini
    JWT_SECRET=my_super_secret_key
    ```

3.  **Seed Database:**

    ```bash
    npm run seed
    ```

4.  **Run Server:**

    ```bash
    npm start
    ```

5.  **Run Tests:**

    ```bash
    npm test
    ```
