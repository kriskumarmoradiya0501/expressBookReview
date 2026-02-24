# 📚 Express.js Book Review REST API

A RESTful API built with Node.js and Express.js for the **IBM Full Stack Software Developer** Coursera Final Project. Supports book browsing, user authentication with JWT, and review management.

---

## 🚀 Setup & Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd expressbook-review-api

# Install dependencies
npm install

# Start the server
npm start
# Server runs at http://localhost:5000
```

### Run Node.js Async/Promise Tasks (Tasks 10–13)
> Make sure the server is running first!
```bash
node nodejs_tasks.js
```

---

## 📋 API Endpoints

### 🔓 General (Public) Endpoints

| Task | Method | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | GET | `/` | Get all books |
| 2 | GET | `/isbn/:isbn` | Get book by ISBN |
| 3 | GET | `/author/:author` | Get books by author |
| 4 | GET | `/title/:title` | Get books by title |
| 5 | GET | `/review/:isbn` | Get reviews for a book |
| 6 | POST | `/register` | Register a new user |

### 🔐 Authentication

| Task | Method | Endpoint | Description |
|------|--------|----------|-------------|
| 7 | POST | `/customer/login` | Login and get JWT token |

### 🔒 Authenticated Endpoints (Require JWT Bearer Token)

| Task | Method | Endpoint | Description |
|------|--------|----------|-------------|
| 8 | PUT | `/customer/auth/review/:isbn?review=<text>` | Add/update a book review |
| 9 | DELETE | `/customer/auth/review/:isbn` | Delete your book review |

---

## 🧪 Testing the API

### Task 1 – Get all books
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
```

### Task 2 – Get book by ISBN
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/isbn/1" -Method Get
```

### Task 3 – Get books by Author
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/author/Jane%20Austen" -Method Get
```

### Task 4 – Get books by Title
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/title/Pride" -Method Get
```

### Task 5 – Get book reviews
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/review/1" -Method Get
```

### Task 6 – Register New User
```powershell
$body = @{ username = "john"; password = "pass123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/register" -Method Post -Body $body -ContentType "application/json"
```

### Task 7 – Login
```powershell
$body = @{ username = "john"; password = "pass123" } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://localhost:5000/customer/login" -Method Post -Body $body -ContentType "application/json"
$token = $resp.token
```

### Task 8 – Add/Modify Review (requires login)
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/customer/auth/review/1?review=Amazing+book!" -Method Put -Headers $headers
```

### Task 9 – Delete Review (requires login)
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/customer/auth/review/1" -Method Delete -Headers $headers
```

### Tasks 10–13 – Node.js Async/Promise Client
```bash
node nodejs_tasks.js
```

---

## 🗂️ Project Structure

```
expressbook-review-api/
├── index.js              # Main server entry point
├── nodejs_tasks.js       # Tasks 10-13: Async/Promise with Axios
├── package.json
└── router/
    ├── booksdb.js        # In-memory books database
    ├── general.js        # Public routes (Tasks 1-6)
    └── auth_users.js     # Auth routes (Tasks 7-9)
```

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js** — REST API framework
- **jsonwebtoken** — JWT-based authentication
- **express-session** — Session management
- **Axios** — HTTP client for async tasks (Tasks 10–13)

---

## 📝 Node.js Async Methods (Tasks 10–13)

| Task | Method | Technique |
|------|--------|-----------|
| 10 | Get all books | `async/await` with Axios |
| 11 | Search by ISBN | Promises (`.then()/.catch()`) with Axios |
| 12 | Search by Author | `async/await` with Axios |
| 13 | Search by Title | `async/await` with Axios |
