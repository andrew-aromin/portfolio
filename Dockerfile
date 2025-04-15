FROM node:20

# install depedencies for headless chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm1 \
    libu2f-udev \
    libvulkan1 \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# add a nonroot user
RUN useradd -m temp

# switch to non root user
USER temp

# Set working directory
WORKDIR /app

COPY --chown=temp:temp package*.json ./

RUN npm install --omit-dev

COPY --chown=temp:temp . .

RUN npm run build

# Expose backend port
EXPOSE 3005

# Start the backend server
CMD ["npm", "start"]
