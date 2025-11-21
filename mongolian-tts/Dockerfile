# Use a stable slim image
FROM python:3.10-slim

# Environment
ENV PYTHONUNBUFFERED=1 \
    HF_HOME=/cache/huggingface

WORKDIR /app

# Install system deps required for building / audio tooling
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ffmpeg gcc g++ build-essential ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt /app/requirements.txt

# Install Python deps (uses requirements.txt so you can pin versions)
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy app code
COPY app.py /app/app.py

# Create non-root user and ensure cache dir exists
RUN useradd --create-home --shell /bin/bash appuser \
 && mkdir -p ${HF_HOME} \
 && chown -R appuser:appuser ${HF_HOME} /app

USER appuser

EXPOSE 8000

# Optional healthcheck (adjust as needed)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD curl -f http://127.0.0.1:8000/ || exit 1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
