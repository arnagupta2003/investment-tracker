# How to Run with Docker/Podman

## Prerequisites
- Docker or Podman installed.
- Docker Compose or Podman Compose installed.

## Setup in this Environment
I have pre-installed `podman-docker` and `podman-compose` for you.

## Quick Start
1.  **Start the Application**:
    Run the helper script:
    ```bash
    ./start_app.sh
    ```
    Or manually:
    ```bash
    podman-compose up --build -d
    ```

2.  **Access the Application**:
    - **Frontend**: [http://localhost:8080](http://localhost:8080)
    - **Backend**: [http://localhost:5001](http://localhost:5001)

3.  **Stop the Application**:
    ```bash
    podman-compose down
    ```

## Notes
- **Rootless Podman**: The setup is configured for rootless Podman (standard on this system).
- **Ports**: Frontend runs on port `8080` (unprivileged) instead of `80`.
- **Database**: Persisted in `data_volume`.
- **Troubleshooting**: If you see permission errors, ensure you are running `podman-compose` and not `docker-compose` if the Docker socket is not configured.
