# Macroprocessor (Vite + React + Tailwind + FastAPI)

## Overview
This project is a full-stack web application consisting of:
- Frontend: React (Vite) with Tailwind CSS
- Backend: Python (FastAPI)

---
## Prerequisites

Ensure the following are installed:

- Node.js (v18 or higher)
- npm
- Python (v3.10 or higher)
- pip

---

## Getting Started (Contributors)

### Fork the Repository

Fork the repository using the GitHub interface.

---

### Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/MacroProcessor.git
cd MacroProcessor
```

---

### Add Upstream Remote

Link your fork to the original repository:

```bash
git remote add upstream https://github.com/AryaPhansalkar/MacroProcessor.git
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Before running frontend create a .env file in frontend folder and write paste:

```bash
VITE_API_URL=http://127.0.0.1:8000
```

The frontend will run at:
```
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend
python -m venv venv
```

### Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Server

```bash
uvicorn main:app --reload
```

The backend will run at:
```
http://127.0.0.1:8000
```

---

## Development Workflow

### Commit Changes

```bash
git add .
git commit -m "Add: brief description of change"
```

Before pushing, pull the latest updates from the main repository to avoid conflicts:

```bash
git pull upstream main
```
Then push your branch:

```bash
git push origin main
```

### Submit a Pull Request

- Navigate to your fork on GitHub
- Select "Compare & Pull Request"
- Submit your changes for review

---

## API Configuration

The frontend communicates with the backend at:
```
http://127.0.0.1:8000
```

Ensure both services are running concurrently during development.

---

## Testing

- Frontend: http://localhost:5173  
- Backend API Documentation: http://127.0.0.1:8000/docs  

---

## Technology Stack

- React (Vite)
- Tailwind CSS
- FastAPI
- Python

---

## Notes

- Do not commit `venv/` or `node_modules/`
- Always synchronize with the upstream repository before starting work
- Use clear branch names and meaningful commit messages


- Authentication and authorization
- Database integration
- Deployment (e.g., Vercel for frontend, Render for backend)

