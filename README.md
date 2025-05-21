# Book Review API

A RESTful API for managing books and user reviews, built with Node.js, Express, TypeORM and MySQL.

---

## 1. Project Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)
- (Optional) [Postman](https://www.postman.com/) or `curl` for testing

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd book-review-api
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database and JWT settings.
   - Example:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=your_db_user
     DB_PASSWORD=your_db_password
     DB_DATABASE=bookdb_main
     JWT_SECRET=your_jwt_secret
     ```

4. **Set up the database:**
   - Ensure your database is running and accessible.
   - The app will auto-create tables if `synchronize` is enabled in TypeORM config.

---

## 2. How to Run Locally

```sh
npm run build
npm start
```
or (for development with auto-reload):
```sh
npm run dev
```
The API will be available at `http://localhost:3000/` (or your configured port).

---

## 3. Example API Requests

### SignUp a User

```sh
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

### Login

```sh
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

### Add a New Book  (Authenticated users only)

```sh
curl -X POST http://localhost:3000/books/<bookId>/reviews \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"review":"Great book!","rating":8.5}'
```

### Get All Books (with pagination and optional filters by author and genre)

```sh
curl "http://localhost:3000/books?page=1&limit=10&author=Rowling&genre=Fantasy"
```

### Get Book Details by ID  Get book details by ID, including: Average rating and Reviews (with pagination)

```sh
curl "http://localhost:3000/books/<bookId>?page=1&limit=5"
```

### Submit a Review (Authenticated users only, one review per user per book)

```sh
curl -X POST http://localhost:3000/books/<bookId>/reviews \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"review":"Great book!","rating":8.5}'
```

### Update Your Review

```sh
curl -X PUT http://localhost:3000/reviews/<reviewId> \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"review":"Updated review text","rating":9.0}'
```

### Delete Your Review
```sh
curl -X DELETE http://localhost:3000/reviews/<reviewId> \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" 
```

### Search Books by Title or Author (pagination is optional here)

```sh
curl "http://localhost:3000/search?keyword=harry&page=1&limit=5"
```

---

## 4. Design Decisions & Assumptions

- **Authentication:** JWT-based authentication is used. Protected routes require a valid token.
- **One Review per User per Book:** Enforced at the API and database level.
- **Pagination:** All list endpoints support `page` and `limit` query parameters.
- **Filtering:** `/books` supports filtering by `author` and `genre`.
- **Search:** `/search` endpoint allows partial, case-insensitive search on title or author.
- **Validation:** Input is validated for required fields, review length, and rating range.
- **Error Handling:** Returns appropriate HTTP status codes and error messages.
- **Entities:** Follows normalized relational design with clear foreign key relations.
- **Extensibility:** The DAL/BLL/controller structure allows for easy extension and maintenance.

---

**Assumptions:**
- Users must be registered and authenticated to submit or update reviews.
- Each review is associated with a single book and user.
- Ratings are decimal numbers between 0.0 and 9.9.
- The API is stateless and does not manage user sessions.

---

## 4. Database Schema

The Book Review API uses a relational database with the following tables:

### users

| Column     | Type         | Constraints                        |
|------------|--------------|------------------------------------|
| id         | char(36)     | PRIMARY KEY, uuid() default        |
| email      | varchar(100) | UNIQUE, nullable                   |
| password   | varchar(255) | nullable                           |
| isActive   | tinyint(1)   | default 1                          |
| createdAt  | datetime     | default CURRENT_TIMESTAMP          |
| updatedAt  | datetime     | nullable                           |

### books

| Column     | Type         | Constraints                        |
|------------|--------------|------------------------------------|
| id         | char(36)     | PRIMARY KEY, uuid() default        |
| title      | varchar(100) | nullable                           |
| author     | varchar(100) | nullable                           |
| genre      | varchar(100) | nullable                           |
| isActive   | tinyint(1)   | default 1                          |
| createdBy  | char(36)     | FOREIGN KEY → users(id), nullable  |
| createdAt  | datetime     | default CURRENT_TIMESTAMP          |
| updatedAt  | datetime     | nullable                           |

### reviews

| Column     | Type         | Constraints                        |
|------------|--------------|------------------------------------|
| id         | char(36)     | PRIMARY KEY, uuid() default        |
| bookId     | varchar(100) | FOREIGN KEY → books(id), nullable  |
| review     | varchar(500) | nullable                           |
| rating     | int          | nullable                           |
| isActive   | tinyint(1)   | default 1                          |
| createdBy  | char(36)     | FOREIGN KEY → users(id), nullable  |
| createdAt  | datetime     | default CURRENT_TIMESTAMP          |
| updatedAt  | datetime     | nullable                           |

**Relationships:**
- Each book is created by a user (`books.createdBy → users.id`).
- Each review is linked to a book (`reviews.bookId → books.id`) and a user (`reviews.createdBy → users.id`).

---

**Book Review System SQL DDL Queries:(MySQL)**

```sql
CREATE TABLE users (
  id char(36) NOT NULL PRIMARY KEY DEFAULT (uuid()),
  email varchar(100) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  isActive tinyint(1) DEFAULT 1,
  createdAt datetime DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL
);

CREATE TABLE books (
  id char(36) NOT NULL PRIMARY KEY DEFAULT (uuid()),
  title varchar(100) DEFAULT NULL,
  author varchar(100) DEFAULT NULL,
  genre varchar(100) DEFAULT NULL,
  isActive tinyint(1) DEFAULT 1,
  createdBy char(36) DEFAULT NULL,
  createdAt datetime DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);

CREATE TABLE reviews (
  id char(36) NOT NULL PRIMARY KEY DEFAULT (uuid()),
  bookId varchar(100) DEFAULT NULL,
  review varchar(500) DEFAULT NULL,
  rating int DEFAULT NULL,
  isActive tinyint(1) DEFAULT 1,
  createdBy char(36) DEFAULT NULL,
  createdAt datetime DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  FOREIGN KEY (bookId) REFERENCES books(id),
  FOREIGN KEY (createdBy) REFERENCES users(id)
);
```

---