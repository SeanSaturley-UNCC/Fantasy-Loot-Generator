# 🚀 Fantasy Loot Generator

---

## 🧰 1. Installation

Make sure you have the following installed:

- [Docker Compose](https://docs.docker.com/compose/install/)  
- (Dev only) [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

---

## 🏃 2. Running the Project

### A - Installing Packages
```bash
cd client; npm install; cd ../
cd server; npm install; cd ../
```

### Production
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Development
```bash
npm run dev
```
