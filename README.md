
# 📡 Content Broadcasting System (Backend)

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![AWS](https://img.shields.io/badge/Cloud-AWS-orange)
![PM2](https://img.shields.io/badge/Process-PM2-critical)
![Nginx](https://img.shields.io/badge/Server-Nginx-success)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow)
![Status](https://img.shields.io/badge/Status-Deployed-brightgreen)

Hi, I'm **Anubhav** 👋
This project is a **production-ready backend system** built with **Express.js** that enables:

* Teachers → Upload content
* Principals → Approve/Reject content
* Students → Access scheduled content via public APIs

---

# 🧠 System Overview

A real-world backend system implementing:

* Authentication & RBAC
* Content lifecycle (upload → approval → broadcast)
* Subject-based scheduling & rotation
* Public content delivery API
* Edge case handling

---

# 🏗️ Architecture Diagram

```mermaid
flowchart LR
    A[Client / Postman] --> B[Nginx]
    B --> C[Express.js App (EC2)]
    C --> D[PM2 Process Manager]
    C --> E[Rate Limiter Middleware]
    C --> F[Auth & RBAC]
    C --> G[Controllers / Services]

    G --> H[(PostgreSQL - AWS RDS)]
    G --> I[Local File Storage]

    %% Future
    G -. Future .-> J[(Redis Cache)]
    G -. Future .-> K[Queue System]
    I -. Future .-> L[(AWS S3)]
```

---

# 🚀 Tech Stack

* **Backend:** Express.js (Node.js)
* **Database:** AWS RDS (PostgreSQL)
* **Deployment:** AWS EC2
* **Process Manager:** PM2
* **Reverse Proxy:** Nginx
* **Authentication:** JWT + RBAC
* **Security:** Rate Limiting

---

# 🌐 Deployment Architecture

* Hosted on **AWS EC2**
* **Nginx** handles incoming traffic (reverse proxy)
* **PM2** ensures app uptime & process management
* **AWS RDS PostgreSQL** used for persistent storage

---

# ⚙️ Core Features

* 🔐 JWT Authentication + Role-Based Access (Principal / Teacher)
* 📤 Content Upload (JPG, PNG, GIF)
* ✅ Approval Workflow
* 📡 Public Broadcasting API
* ⏱️ Subject-based Scheduling & Rotation
* 🚫 Edge Case Handling
* 🛡️ Rate Limiting

---

# 🔄 Workflow

```text
Teacher → Upload Content → Pending
Principal → Approve / Reject
Approved Content → Scheduled
Public API → Serves Active Content
```

---

# 📁 Project Structure

```bash
src/
│── controllers/
│── routes/
│── services/
│── middlewares/
│── models/
│── utils/
```

---

# 📚 API Documentation

* 📌 API docs link submitted via assignment form
* 📦 Postman collection available in this repo
* 🌍 Live API link also submitted via form

👉 Use Postman environment variables to test APIs

---

# 🧪 Run Locally

## 🔑 Environment Variables

```env
DB_USER=postgres
DB_HOST=amazonaws.com
DB_NAME=postgres
DB_PASSWORD=
DB_PORT=5432

PORT=3000
JWT_SECRET=your choice

DB_SSL_CERT=
```

## ▶️ Run Commands

```bash
npm install
npm run dev
```

---

# ⚠️ Limitations / Assumptions

* 📂 Files stored in **local storage**

  * S3 could be integrated easily
* ⚡ Redis **not implemented**

  * Could be used for caching frequent queries
* 🧱 No DB indexing (can improve performance)
* 🔄 Queue system (Redis-based) planned but not implemented

---

# 🚀 Future Improvements

* ☁️ AWS S3 integration for file storage
* ⚡ Redis caching (~70% query optimization)
* 🔁 Background job queue system
* 📊 Analytics (content usage, subject insights)
* 🧱 DB indexing & performance tuning

---

# 🛡️ Security

* JWT-based authentication
* RBAC (Principal / Teacher separation)
* Protected routes
* Input validation & error handling
* Rate limiting


# 🙌 Author

**Anubhav**

---

* turn this into a **resume-worthy project explanation**
* or help you prepare **interview questions + answers based on this project** 🔥
