# Define the build platform (adjust if needed)
FROM --platform=$BUILDPLATFORM python:3.10-alpine AS builder

WORKDIR /app


# Copy requirements.txt and install dependencies
COPY . /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Set environment variables for Uvicorn
ENV UVICORN_MAIN main:app
ENV UVICORN_HOST 0.0.0.0
ENV UVICORN_PORT 8000
ENV UVICORN_LOG_LEVEL info  # Adjust logging level as needed (e.g., debug, warning)
ENV UVICORN_RELOAD True     # Enable reloading on code changes

# Expose the port for Uvicorn
EXPOSE 8000

# Run Uvicorn command
CMD ["uvicorn", "$UVICORN_MAIN", "--host", "0.0.0.0", "--port", "8000", "--reload"]
