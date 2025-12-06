# Online Shopping API

## Project Description

This is a RESTful API built for the "Online Shopping" system. It allows store managers to track online orders, manage inventory items, and assign shoppers to orders.

## Technologies Used

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (via Sequelize ORM)
- **Testing:** Jest & Supertest

## Setup Instructions

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Seed the Database:**
    (This resets the database and adds test data like "John Doe" and "Manager Mike")

    ```bash
    npm run seed
    ```

3.  **Start the Server:**

    ```bash
    npm start
    ```

    The server will run at `http://localhost:3000`.

4.  **Run Tests:**
    ```bash
    npm test
    ```

## API Endpoints

### Orders

| Method     | Endpoint      | Description                        | Request Body Example                                                  |
| :--------- | :------------ | :--------------------------------- | :-------------------------------------------------------------------- |
| **GET**    | `/orders`     | Fetch all orders (includes items). | N/A                                                                   |
| **POST**   | `/orders`     | Create a new order.                | `{ "customerName": "John", "pickupTime": "5pm", "isDelivery": true }` |
| **PATCH**  | `/orders/:id` | Update an order (e.g., status).    | `{ "status": "completed" }`                                           |
| **DELETE** | `/orders/:id` | Delete an order.                   | N/A                                                                   |

### Items

| Method   | Endpoint | Description              | Request Body Example                              |
| :------- | :------- | :----------------------- | :------------------------------------------------ |
| **POST** | `/items` | Add an item to an order. | `{ "name": "Milk", "price": 2.99, "orderId": 1 }` |

## Future Improvements

- **Authentication:** Adding Login/Register for Admins and Shoppers.
- **Authorization:** Restricting `DELETE` routes to Admins only.
- **Frontend:** Building a React dashboard for visualizing orders.
