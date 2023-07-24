# build instructions
# Stage 1
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
ENV CLIENT_ID=83137024241-048f1j11et4aenjjg5ntk5o1leu8uqum.apps.googleusercontent.com \
    CLIENT_SECRET=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
EXPOSE 3000
CMD ["yarn","start"]  

