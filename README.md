# LeetCode Clone

DSAPrep is a full-stack web application designed for practicing Data Structures and Algorithms. Users can browse problems, write code in an integrated IDE, and execute/submit their solutions against test cases using the Judge0 execution engine.

## Features

- **Problem Set**: A curated list of DSA problems with varying difficulties.
- **Interactive Workspace**: A split-pane workspace with problem descriptions and a powerful code editor.
- **Code Editor**: Powered by Monaco Editor (the core of VS Code) with syntax highlighting and theme support.
- **Code Execution**: Real-time code execution and submission using [Judge0](https://ce.judge0.com/).

## Tech Stack

### Backend

- **Framework**: Spring Boot 3.3.3
- **Language**: Java 17
- **Security**: Spring Security with JWT
- **Database**: PostgreSQL
- **Migrations**: Flyway
- **Build Tool**: Maven

### Frontend

- **Framework**: React 18 (with Vite and TypeScript)
- **Editor**: Monaco Editor (`@monaco-editor/react`)

### Infrastructure

- **Code Execution**: Judge0 (RapidAPI or Self-hosted)
- **Containerization**: Docker (for PostgreSQL and optional Judge0 setup)

## Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **Docker** and Docker Compose
- **Maven**
- **Judge0 API Key** (if using the cloud version) or a local Judge0 instance.

## Setup & Installation

### 1. Database Setup

The project uses PostgreSQL. You can run it easily using Docker:

```bash
docker run --name dsaprep-db -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=dsaprep -p 5432:5432 -d postgres
```

### 2. Judge0 Setup

You need a running Judge0 instance.

- **Self-hosted**: Follow the [Judge0 Deployment Procedure](https://github.com/judge0/judge0/blob/master/CHANGELOG.md#deployment-procedure).
- **Documentation**: Refer to the [Judge0 CE API Documentation](https://ce.judge0.com/).

### 3. Backend Configuration

Navigate to the `dsaprep` directory and create a `.env` file based on `.env.example`:

```bash
cd dsaprep
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATASOURCE_URL=jdbc:postgresql://localhost:5432/dsaprep
DATASOURCE_USERNAME=your_user
DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_at_least_32_chars
JWT_EXPIRATION=86400000
CLIENT_URL_1=http://localhost:5173
JUDGE0_API_URL=http://localhost:2358
```

Run the backend:

```bash
source .env
export $(grep -v '^#' .env | xargs)
mvn spring-boot:run
```

### 4. Frontend Configuration

Navigate to the `dsaprep-client` directory and create a `.env` file:

```bash
cd dsaprep-client
cp .env.example .env
```

Edit `.env`:

```env
VITE_BASE_URL=http://localhost:8080
VITE_API_VERSION=/api/v1
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## 🖥️ Development

This project is optimized for development in **VS Code**.

- Recommended Extensions: Extension Pack for Java, Spring Boot Extension Pack, ESLint, Prettier.
