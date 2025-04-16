FROM node:20

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
