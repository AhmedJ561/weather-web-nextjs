FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Pass your API key at build time:
# docker build --build-arg API_KEY=your_key_here -t weatherscope .
ARG API_KEY
ENV NEXT_PUBLIC_OPENWEATHER_API_KEY=$API_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
