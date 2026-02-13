# How to Run with Docker

## Prerequisites
- Docker and Docker Compose installed on your machine.

## Steps

1.  **Build and Start Containers**
    Run the following command in the root directory:
    ```bash
    docker compose up --build
    ```

2.  **Access the Application**
    - **Frontend:** Open [http://localhost](http://localhost) (or just `http://localhost:80`)
    - **Backend:** Accessible internally at `http://backend:5001`. The frontend proxies configuration means you don't need to access the backend directly, but it's mapped to `localhost:5001` as well.

3.  **Data Persistence**
    - The SQLite database is persisted in a Docker volume named `data_volume`.
    - If you want to view the database file, you can inspect the volume or mount a local directory in `docker-compose.yml`.

4.  **Stopping the Application**
    Press `Ctrl+C` or run:
    ```bash
    docker compose down
    ```

## Project Structure for Docker
- `server/Dockerfile`: Node.js backend setup.
- `client/Dockerfile`: Multi-stage build (Node.js build -> Nginx serve).
- `client/nginx.conf`: Nginx configuration for serving React and proxying API calls.
- `docker-compose.yml`: Orchestration for both services.
