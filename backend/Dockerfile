# Define the build platform (adjust if needed)
FROM --platform=$BUILDPLATFORM python:3.10-alpine AS builder

WORKDIR /app


# Copy requirements.txt and install dependencies
COPY . /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Expose the port for Uvicorn
EXPOSE 8000

# Run Uvicorn command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
