<div align="center">
  <img src="./front/src/assets/logo/newPostLogo.jpeg" alt="New Post Logo" width="200"/>

# New Post - Parcel Management System

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/-shadcn%2Fui-000000?style=flat&logo=radixui&logoColor=white)
![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![Zustand](https://img.shields.io/badge/-Zustand-443E38?style=flat&logo=react&logoColor=white)

![CodeceptJS](https://img.shields.io/badge/-CodeceptJS-F6E05E?style=flat&logo=codeceptjs&logoColor=black)
![Puppeteer](https://img.shields.io/badge/-Puppeteer-40B5A4?style=flat&logo=puppeteer&logoColor=white)
![Gherkin](https://img.shields.io/badge/-Gherkin-00A818?style=flat&logo=cucumber&logoColor=white)

![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat&logo=nginx&logoColor=white)
![Docker%20Compose](https://img.shields.io/badge/-Docker_Compose-2496ED?style=flat&logo=docker&logoColor=white)
</div>

---

## 📦 About The Project

**New Post** is a web platform for online parcel registration, tracking, and management, built for the New Post logistics company.

Customers can register parcels without creating an account, calculate delivery cost, select pickup points, pay online, and track their parcels.

Employees can view all orders, update statuses, assign partner tracking numbers, and print labels.

🌐 **Demo** [http://159.223.230.6:8080](http://159.223.230.6:8080)
---

## 🚀 Main Features

### 💼 Client Side

-  Register parcels online without account
-  Get tracking number after registration
-  Delivery cost calculator
-  Pickup point selection via e-kit.pro API
-  Track parcel by tracking number

### 🧑‍💻 Employee Dashboard

-  Search by tracking number or customer name
-  Manual status updates up to "sent"
-  Auto-status updates via partner API
-  Partner tracking number assignment
-  Label printing for thermal printers

---

## 🧩 Tech Stack

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

- Express.js
- Mongoose (MongoDB)
- dotenv, CORS
- JWT authentication (planned)

### Frontend
![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/-Zustand-443E38?style=flat&logo=react&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/-shadcn%2Fui-000000?style=flat&logo=radixui&logoColor=white)
![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=flat&logo=axios&logoColor=white)

- React 18 + TypeScript + Vite
- Zustand for state management
- Tailwind CSS + shadcn/ui for styling
- Axios for API communication
- React Router for navigation


### Testing
![CodeceptJS](https://img.shields.io/badge/-CodeceptJS-F6E05E?style=flat&logo=codeceptjs&logoColor=black)
![Puppeteer](https://img.shields.io/badge/-Puppeteer-40B5A4?style=flat&logo=puppeteer&logoColor=white)
![Gherkin](https://img.shields.io/badge/-Gherkin-00A818?style=flat&logo=cucumber&logoColor=white)

- **CodeceptJS** - E2E testing framework
- **Puppeteer** - Headless browser automation
- **Gherkin** - BDD-style test scenarios
- **TypeScript** - Type-safe test steps

### DevOps
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat&logo=nginx&logoColor=white)
![Docker%20Compose](https://img.shields.io/badge/-Docker_Compose-2496ED?style=flat&logo=docker&logoColor=white)

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Production web server

---

## ⚙️ Installation

### Prerequisites
- Node.js >= 18.x
- npm
- MongoDB

## 🐳 Docker Deployment

The project is fully containerized and can be deployed using Docker.

### Services

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **MongoDB**: `localhost/new-post-test`

### Production Deployment

The application is deployed and accessible at:

🌐 **[http://159.223.230.6:8080](http://159.223.230.6:8080)**

### Docker Configuration
```yaml
# docker-compose.yml structure
services:
  frontend:  # React + Vite app with Nginx
  backend:   # Express API
  mongodb:   # MongoDB database
```

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

# Install test dependencies (optional)
cd tests
npm install
cd ..

# Setup environment variables
cp .env.template .env
# Edit .env with your configuration

# Run backend 
cd backend
npm run seed
npm run dev

# Run frontend (in separate terminal)
cd front
npm run dev
```
### Running Tests
```bash
# Install test dependencies
cd tests
npm install

# Run tests with HTML report
npm run test
---

## 🔗 Integrations

- **e-kit.pro API** — Pickup point map integration
- **Partner API** — Real-time tracking synchronization
- **Sticker Print API** — Thermal label printing

```
## 📁 Project Structure

```
NEW-POST/
├── back/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── utils/
│   ├── public/
│   ├── config.ts
│   ├── index.ts
│   ├── multer.ts
│   ├── fixtures.ts
│   ├── types.d.ts
│   ├── .env
│   ├── Dockerfile
│   ├── Dockerfile.production
│   ├── tsconfig.json
│   ├── ...
│   └── package-lock.json
│
├── front/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── i18n/
│   │   ├── lib/
│   │   ├── stores/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── .env.production
│   ├── Dockerfile
│   ├── Dockerfile.production
│   ├── nginx.conf
│   ├── eslint.config.js
│   ├── components.json
│   ├── ...
│   └── package-lock.json
│
├── tests/
│   ├── features/
│   │   ├── admin/
│   │   └── user/
│   ├── step_definitions/
│   │   ├── admin/
│   │   └── user/
│   ├── helpers/
│   │   └── i18nHelper.ts
│   ├── output/
│   ├── steps.ts
│   ├── steps_file.ts
│   ├── steps.d.ts
│   ├── codecept.conf.ts
│   ├── tests.sh
│   ├── tsconfig.json
│   ├── ...
│   └── package-lock.json
│ 
├── compose.yaml
├── compose.prod.yaml
├── README.md
└── .gitignore
```

---

## 🧠 Roadmap

### ✅ Implemented

**Client Side:**
- ✅ Parcel registration without account creation
- ✅ Delivery cost calculator
- ✅ Pickup point selection on map (e-kit.pro API)
- ✅ Parcel tracking by tracking number
- ✅ Multi-language support (Russian, Kyrgyz)

**Admin Panel:**
- ✅ Parcel management system
- ✅ Administrator management (Super Admin)
- ✅ Search by tracking number and customer name
- ✅ Parcel status updates
- ✅ Thermal printer label printing
- ✅ Partner tracking number assignment

**Development & Testing:**
- ✅ E2E testing with CodeceptJS and Puppeteer
- ✅ Docker containerization
- ✅ Production server deployment
- ✅ Status synchronization via partner API

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