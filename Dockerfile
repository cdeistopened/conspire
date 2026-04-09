FROM node:22-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ARG VITE_CONVEX_URL
ARG VITE_PROOF_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
ENV VITE_PROOF_URL=$VITE_PROOF_URL
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["node", "server.js"]
