FROM python:3.10-slim

WORKDIR /app

# Install system deps for scipy
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg gcc g++ build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
RUN pip install --no-cache-dir \
    torch \
    transformers \
    accelerate \
    fastapi \
    uvicorn[standard] \
    scipy \
    numpy

# Copy app
COPY app.py /app/app.py

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
