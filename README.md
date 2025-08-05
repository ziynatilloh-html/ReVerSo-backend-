# ReVer:So Backend

> Backend for the ReVer:So e-commerce platform and admin panel.

This repository contains the server-side logic for ReVer:So — handling everything from authentication and member management to orders, products, analytics, and Google OAuth login. It's built with **TypeScript**, **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Project Structure

```
src/
├── controllers/             # Route handlers (API logic)
│   ├── member.controller.ts
│   ├── admin.controller.ts
│   ├── product.controller.ts
│   ├── order.controller.ts
│   └── googleAuth.controller.ts

├── services/                # Core business logic
│   ├── Member.service.ts
│   ├── Auth.Service.ts
│   ├── Product.service.ts
│   ├── Order.Service.ts
│   ├── View.Service.ts
│   └── Analytics.Service.ts

├── routes/                  # Route definitions
│   ├── router.ts
│   ├── router-admin.ts
│   ├── router.auth.ts

├── config/                  # Config and session typing
│   ├── config.ts
│   └── express-session.d.ts

├── middleware/              # Error handling
│   └── Error.ts

├── utils/                   # Email, uploads, helpers
│   ├── email.ts
│   ├── uploader.ts
│   └── common.ts

├── models/                  # Mongoose schemas
│   ├── member.ts
│   ├── product.ts
│   ├── order.ts
│   └── view.ts

├── app.ts                   # Express app setup
└── server.ts                # App entry point
```

---

## 🧩 Features

- 🔐 **Authentication**
  - Google OAuth2 (via Passport.js)
  - Session-based login with `express-session`
- 👥 **Member Management** (Admin panel)
- 🛍️ **Product Management** (CRUD)
- 📦 **Order System** with session tracking
- 📊 **View & Analytics Tracking**
- 📤 **Image Uploads** with Multer
- 📧 **Email notifications** using Nodemailer
- 🧠 **Session Store**: MongoDB

---

## ⚙️ Tech Stack

- **Node.js**, **Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **Passport.js (Google OAuth2)**
- **Multer** for image upload
- **Nodemailer** for email
- **Stripe** for payments
- **Helmet, CORS, Morgan** for security and logging

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/reverso-backend.git
cd reverso-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the root directory with the following keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reverso
SESSION_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password
STRIPE_SECRET_KEY=your_stripe_key
```

### 4. Run the project

```bash
# Development
npm run start:dev

# Production
npm run build
npm start
```

---

## 📜 Scripts

| Command            | Description                      |
|--------------------|----------------------------------|
| `npm run build`    | Compile TypeScript               |
| `npm run start`    | Run compiled JS server           |
| `npm run start:dev`| Run in development (ts-node)     |

---

## 📸 Project Preview

> Add a preview image below:
```![photo_2025-08-05 23 34 22](https://github.com/user-attachments/assets/a23329cc-42a5-4a63-9db6-b5427c615abc)![photo_2025-08-05 23 34 16](https://github.com/user-attachments/assets/0e8af7c9-5440-468d-ada6-9d24e619cf07)

```

---

## 📄 License

MIT © Ziynatilloh
