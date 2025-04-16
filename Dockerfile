FROM node:20-alpine

# Set working directory
WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install --omit-dev

COPY --chown=node:node . .

RUN npm run build

# switch to non root user
USER node

# Expose backend port
EXPOSE 3005

# Start the backend server
CMD ["npm", "start"]
