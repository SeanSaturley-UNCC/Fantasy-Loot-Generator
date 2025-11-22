# 🚀 Docker Full Stack Template

**Author:** Peyton Santo

A simple full-stack Docker template for development and production.

---

## 🧰 1. Installation

Make sure you have the following installed:

- [Docker Compose](https://docs.docker.com/compose/install/)  
- (Dev only) [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

---

## 🏃 2. Running the Project

### Production
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Development
```bash
npm run dev
```

## 3. Other Notes

- You can update the ports where the client/server/database are running if necessary.  
  **Defaults are shown below:**
* Client: 1234
* Server: 5678
* Database: 1919


- This build has only been tested on **Linux**.  
Please let me know of any issues that arise from running on **Windows** or **macOS**.

---

✅ **Tip:** Keep your environment variables and port mappings consistent across the `docker-compose.yml` and any client configuration files.
