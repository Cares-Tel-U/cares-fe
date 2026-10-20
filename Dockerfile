# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder
WORKDIR /app

# Salin file manifest dependensi
COPY package.json package-lock.json ./
RUN npm ci

# Salin seluruh berkas kode sumber frontend
COPY . .

# Parameter build environment untuk konfigurasi alamat API
ARG VITE_API_BASE_URL=http://localhost:5001
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Eksekusi kompilasi bundel produksi Vite
RUN npm run build

# Stage 2: Nginx Web Server Runner
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Bersihkan halaman statis bawaan Nginx
RUN rm -rf ./*

# Salin aset hasil kompilasi dari stage builder
COPY --from=builder /app/dist ./

# Salin berkas konfigurasi Nginx untuk perutean SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
