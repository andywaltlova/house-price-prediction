FROM node:18 AS build

WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY react-frontend/package*.json ./
RUN npm install
COPY react-frontend/ ./
RUN npm run build

# Stage 2: Setup Flask app
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend code
COPY flask-backend/ /app

# Copy the React build files from the first stage
COPY --from=build /app/frontend/dist /app/static

# Install Flask dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 to the outside world
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]