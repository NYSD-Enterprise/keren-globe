# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-10-07

### Features (Frontend)
- **Premium UI Overhaul:** Replaced the default React scaffolding with a fully custom, high-end "Destinations Explorer" dashboard using Vanilla CSS.
- **Glassmorphism Design System:** Implemented a modern dark-mode aesthetic featuring frosted glass cards, subtle gradients, and micro-animations on hover.
- **Authentication Flow:** Built gorgeous, fully responsive `Login` and `Register` pages matching the new UI.
- **Centralized API Management:** Refactored the authentication flow to utilize a centralized Axios instance (`Services/Api.js`) for cleaner code, unified error handling, and robust CORS management.
- **Dynamic Routing:** Configured React Router to smoothly redirect users from Registration -> Login -> Dashboard upon successful authentication.

### Infrastructure & DevOps
- **Microservices Architecture:** Fully containerized the application stack into 6 separate Docker containers (`api-gateway`, `auth-service`, `destination-service`, `itinerary-service`, `recommendation-service`, and `frontend`).
- **Dynamic Traefik Routing:** Configured `docker-compose.vps.yml` with Traefik labels to automatically map services to dynamic `nip.io` domain names.
- **GitHub Actions CI/CD Pipeline:** Built and refined `.github/workflows/deploy.yml` to:
  - Connect securely to the VPS via SSH.
  - Dynamically generate `.env` files with API URLs specific to the deployment environment.
  - Correctly checkout the triggering Git branch instead of defaulting to `main`.
  - Rebuild and restart the Docker stack automatically upon successful push.

### Bug Fixes (Backend)
- **API Gateway Routing Bug:** Fixed a critical issue where the API gateway blindly forwarded traffic to `localhost`, causing "Connection Refused" errors inside the Docker network. Traffic is now securely routed using internal Docker container names passed via environment variables.
- **Missing Auth Routes:** Exposed `POST /register` and `POST /login` routes through the API Gateway so the frontend can successfully authenticate.
- **JWT Signature Crash:** Resolved a `500 Internal Server Error` during login by injecting a secure `JWT_SECRET` environment variable into the Auth Service container via Docker Compose.
- **Nginx Port Conflict:** Fixed an issue where the host-level Nginx server was intercepting API requests on port 80 and returning `404 Not Found`. Explicitly appended port `:5000` to the frontend's environment variables to correctly target the API Gateway container.

### Data & Assets
- **JSON Persistence:** Configured the Node.js microservices to persist data using JSON files stored in a mounted Docker volume (`./data:/app/data`), ensuring data survives container restarts.
- **Initial Data Seeding:** Programmatically seeded the `destinations.json` database with highly curated travel locations.
- **High-Resolution Imagery:** Generated and integrated breathtaking, high-resolution placeholder images (Kyoto, Santorini, Swiss Alps) into the `public/images` directory to populate the dashboard UI instantly.

### Deployment Instructions (GitHub Actions)
To use the automated CI/CD pipeline to deploy this project to a VPS, you must configure the following **Repository Secrets** in GitHub (Settings > Secrets and variables > Actions):
<<<<<<< HEAD
- `VPS_HOST`: The IP address or domain name of your target VPS (e.g., `XXX.XXX.XXX.XXX`).
=======
- `VPS_HOST`: The IP address or domain name of your target VPS (e.g., `157.173.112.19`).
>>>>>>> 56b2fef2ec542f3e523f570ae5bd32d86238380f
- `VPS_SSH_KEY`: A private SSH key that has deployment access to the VPS. Ensure the corresponding public key is in the `~/.ssh/authorized_keys` of the `deploy` user on the VPS.
