# Use the official Node.js 18.16.1 image
FROM node:18.16.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm 9.5.1
RUN npm install -g npm@9.5.1
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3030

# Command to run your application
CMD ["node", "server.js"]
