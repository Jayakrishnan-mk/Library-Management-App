# Library Management App (Backend)

A Node.js + Express + MongoDB backend for a library management system with user/admin roles, JWT authentication, book management, borrowing/returning, and transaction tracking.

---

## Features

- **User & Admin Registration/Login** (JWT Auth)
- **Role-based Access Control** (RBAC)
- **Book Management** (CRUD, admin only)
- **Book Borrow/Return** (user, with borrow limit)
- **Transaction Tracking** (who borrowed/returned what and when)
- **Profile Management** (view/update for user & admin)
- **Admin: View All Users & Their Transactions**

---

## Project Structure

```
project-root/
│   index.js
│   package.json
│   .env
│   postman_collection.json
└───src/
    ├───dtos/
    ├───middleware/
    ├───models/
    ├───routes/
    └───services/
```

---

## Getting Started

1. **Clone the repo**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment**
   - Copy `.env` and set your MongoDB URI, JWT secret, and port:
     ```env
     MONGO_URI=mongodb://localhost:27017/librarydb
     PORT=5000
     JWT_SECRET=your_jwt_secret
     ```
4. **Run the server**
   ```sh
   npm run dev
   # or
   npm start
   ```

---

## API Endpoints

### Auth
- `POST /auth/register` — Register (user/admin)
- `POST /auth/login` — Login

### Books (admin only for create/update/delete)
- `POST /books` — Create book
- `PUT /books/:id` — Update book
- `DELETE /books/:id` — Delete book
- `GET /books` — List all books
- `GET /books/:id` — Get book by ID

### Transactions
- `POST /transactions/borrow` — Borrow a book (user)
- `POST /transactions/return` — Return a book (user)
- `GET /transactions/my` — My transactions (user)
- `GET /transactions/all` — All transactions (admin)

### Profile
- `GET /profile/me` — View my profile
- `PUT /profile/me` — Update my profile

### Users (admin only)
- `GET /users` — List all users
- `GET /users/:id` — Get user details & transactions

---

## Postman Collection

- The full Postman collection is included as `postman_collection.json` in the project root.
- You can also access it online: [Postman Collection Link](https://postman.co/workspace/My-Workspace~392b206e-087a-4088-8de3-b885ca4343fa/collection/27063930-6ceda909-399e-4b69-8b67-fbf8e0b3bfe5?action=share&creator=27063930&active-environment=27063930-e072c2cc-0bbd-48d5-9a93-8cc1f0aa9ecd)
- Import this collection into Postman to test all endpoints easily.

---

## Notes
- All protected routes require a valid JWT token in the `Authorization: Bearer <token>` header.
- Admin-only endpoints are restricted by role.
- Borrow limit is enforced per user (default: 3 books).
- All responses include a `message` field for clarity.

---
