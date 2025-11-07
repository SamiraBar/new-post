<div align="center">
  <img src="./front/src/assets/logo/newPostLogo.jpeg" alt="New Post Logo" width="200"/>

# New Post - Parcel Management System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
![Zustand](https://img.shields.io/badge/-Zustand-443E38?style=flat&logo=react&logoColor=white)
</div>

---

## 📦 About The Project

**New Post** is a web platform for online parcel registration, tracking, and management, built for the New Post logistics company.

Customers can register parcels without creating an account, calculate delivery cost, select pickup points, pay online, and track their parcels.

Employees can view all orders, update statuses, assign partner tracking numbers, and print labels.

---

## 🚀 Main Features

### 💼 Client Side

-  Register parcels online without account
-  Get tracking number after registration
-  Delivery cost calculator
-  Pickup point selection via e-kit.pro API
-  Online payment (planned)
-  Track parcel by tracking number

### 🧑‍💻 Employee Dashboard

-  Search by tracking number or customer name
-  Manual status updates up to "sent"
-  Auto-status updates via partner API
-  Partner tracking number assignment
-  Label printing for thermal printers

---

## 🧩 Tech Stack

### Frontend
![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/-Zustand-443E38?style=flat&logo=react&logoColor=white)

- React 18 + TypeScript + Vite
- Zustand for state management
- Tailwind CSS + shadcn/ui for styling
- Axios for API communication
- React Router for navigation

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

- Express.js
- Mongoose (MongoDB)
- dotenv, CORS
- JWT authentication (planned)

---

## ⚙️ Installation

### Prerequisites
- Node.js >= 18.x
- npm
- MongoDB

### Setup
```bash
# Clone repository
git clone https://github.com/SamiraBar/new-post.git
cd new-post

# Install backend dependencies
cd back
npm install
cd ..

# Install frontend dependencies
cd front
npm install
cd ..

# Run backend 
cd backend
npm run seed
npm run dev

# Run frontend (in separate terminal)
cd front
npm run dev
```

---

## 🔗 Integrations

- **e-kit.pro API** — Pickup point map integration
- **Partner API** — Real-time tracking synchronization
- **Sticker Print API** — Thermal label printing

---

## 📁 Project Structure
```
new-post/
├── front/
│   ├── src/     
│   └── package.json
├── backend/
│   ├── models/           
│   ├── routes/            
│   └── package.json
└── README.md
```

---

## 🧠 Roadmap

- [ ] Add online payment system
- [ ] Implement email / WhatsApp notifications
- [ ] Add delivery analytics dashboard
- [ ] Extend admin features (user management)
- [ ] Mobile application
- [ ] Multi-language support (Кыргызча, Русский)

---

## 🤝 Contributing

We work collaboratively via GitHub. Each developer creates a feature branch and opens a Pull Request to `dev`.

### Guidelines:

1. **Naming branches by tasks**
2. **Code review required before merge**
3. **Follow ESLint & Prettier rules**
4. **Use conventional commits**

---

## 👥 Team

- **Project Manager**: [Angela]
- **Fullstack Developers**: [Dilnoza, Daniella, Arsen, Nikita, Samira, Akylbek, Musulmankul]

---

## 📫 Contact

**New Post Logistics**

- 📍 Address: Bishkek, L. Tolstoy st. 24/1
- 📧 Email: newpostkg@gmail.com

<div align="center">
  Made with ❤️ by New Post Team
</div>