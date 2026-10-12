# Blog API - Node.js & Express (Week 9)

## 1. Project Overview
A simple RESTful API for a blogging platform.
Users can register and login (JWT), create / read / update / delete **posts**, and add **comments** to posts.

**Goals**
- Learn Node.js and Express.js
- Build CRUD APIs, middleware and error handling
- Secure routes with JWT
- Document and test the API with Postman

**Tech:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, dotenv, cors

## 2. Concepts Used
- **Node.js** runs JavaScript on the server. It is *event-driven*: it does not wait for slow work (like database calls), it continues and handles the result when ready (`async/await`).
- **Express.js** makes routing and middleware easy.
- **Middleware** is a function that runs between the request and the response: `logger` (logs requests), `protect` (checks JWT), `requireFields` (validation), `errorHandler` (handles errors).
- **Environment variables** (`.env`) keep secrets like `JWT_SECRET` out of the code.
- **HTTP status codes used:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error.

## 3. Setup Instructions
1. Install [Node.js](https://nodejs.org) and MongoDB (or create a free MongoDB Atlas database).
2. Install packages:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the values:
   ```
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/blog-api
   JWT_SECRET=your_long_random_secret
   JWT_EXPIRES_IN=7d
   ```
4. Start the server:
   ```
   npm start        # normal
   npm run dev      # auto-restart with nodemon
   ```
5. Open `http://localhost:3000/api/health` - you should see `{"status":"ok", ...}`.

## 4. Code Structure
```
server.js                      app starts here
package.json
.env.example
postman-collection.json        Postman tests
src/
  controllers/
    authController.js          register, login, me
    postController.js          post CRUD
    commentController.js       comments
  routes/
    authRoutes.js
    postRoutes.js
    commentRoutes.js
  middleware/
    auth.js                    JWT protect
    errorHandler.js            error + 404 handling
    logger.js                  request logging
    validate.js                request validation
  models/
    User.js  Post.js  Comment.js
```

## 5. API Documentation
All responses use: `{ "success": true/false, "message": "...", "data": {} }`
Protected routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/health | No | Server status |
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, get token |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/posts?page=1&limit=10 | No | List posts |
| GET | /api/posts/:id | No | Get one post |
| POST | /api/posts | Yes | Create post |
| PUT | /api/posts/:id | Yes (author) | Update post |
| DELETE | /api/posts/:id | Yes (author) | Delete post |
| GET | /api/posts/:postId/comments | No | List comments of a post |
| POST | /api/posts/:postId/comments | Yes | Add comment |
| DELETE | /api/comments/:id | Yes (author) | Delete comment |

### Examples

**POST /api/auth/register**
```json
// Request
{ "name": "Asha", "email": "asha@example.com", "password": "password123" }
// Response 201
{ "success": true, "message": "Registered successfully",
  "data": { "token": "JWT_TOKEN", "user": { "id": "...", "name": "Asha", "email": "asha@example.com" } } }
// Error 400
{ "success": false, "message": "Email already registered" }
```

**POST /api/auth/login**
```json
// Request
{ "email": "asha@example.com", "password": "password123" }
// Response 200
{ "success": true, "message": "Login successful", "data": { "token": "JWT_TOKEN", "user": {} } }
// Error 401
{ "success": false, "message": "Invalid email or password" }
```

**POST /api/posts** (needs token)
```json
// Request
{ "title": "My First Post", "content": "Hello from Node.js" }
// Response 201
{ "success": true, "message": "Post created successfully",
  "data": { "_id": "...", "title": "My First Post", "content": "Hello from Node.js", "author": "..." } }
// Error 400
{ "success": false, "message": "Title is required" }
// Error 401
{ "success": false, "message": "Authentication required" }
```

**GET /api/posts**
```json
{ "success": true, "message": "Posts fetched", "page": 1, "limit": 10, "total": 1, "data": [ {} ] }
```

**GET /api/posts/:id**
```json
// Error 404
{ "success": false, "message": "Post not found" }
```

**PUT /api/posts/:id** (author only)
```json
// Request
{ "title": "Updated title" }
// Error 403
{ "success": false, "message": "You can only edit your own posts" }
```

**DELETE /api/posts/:id** (author only)
```json
{ "success": true, "message": "Post deleted successfully", "data": {} }
```

**POST /api/posts/:postId/comments** (needs token)
```json
// Request
{ "text": "Nice post!" }
// Response 201
{ "success": true, "message": "Comment added successfully", "data": {} }
```

## 6. Testing Evidence
Import `postman-collection.json` into Postman and run the requests from top to bottom
(the token and IDs are saved automatically). Each request has a test for its status code.

| Test case | Expected |
|---|---|
| Register new user | 201 |
| Register same email again | 400 |
| Register without email | 400 |
| Login with correct password | 200 + token |
| Login with wrong password | 401 |
| Create post with token | 201 |
| Create post without token | 401 |
| Create post with invalid token | 401 |
| Create post without title | 400 |
| Get post with invalid ID | 404 |
| Update / delete someone else's post | 403 |
| Add / get / delete comment | 201 / 200 / 200 |

## 7. Screenshots
Add your screenshots in the `screenshots/` folder:
- `server-running.png` - server started in terminal
- `postman-register-login.png`
- `postman-create-post.png`
- `postman-error-401.png`
- `mongodb-data.png`

## 8. Deployment (Render)
1. Push this project to GitHub (never upload `.env`).
2. Create a free database on MongoDB Atlas and copy the connection string.
3. On [render.com](https://render.com) create a **New Web Service** from your GitHub repo.
4. Build command: `npm install` - Start command: `npm start`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`.
6. Deploy and test `https://your-app.onrender.com/api/health`.
