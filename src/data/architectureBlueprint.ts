export interface ArchitectureService {
  name: string;
  category: string;
  description: string;
  technologies: string[];
  responsibilities: string[];
  endpoints: { method: string; path: string; desc: string }[];
  resiliencePattern: string;
}

export const ARCHITECTURE_SERVICES: ArchitectureService[] = [
  {
    name: 'Auth & Identity Service',
    category: 'Security & Access',
    description: 'Handles high-throughput authentication, OAuth2 / OIDC social login (Google, Apple, Facebook), passwordless magic links, and granular Role-Based Access Control (RBAC).',
    technologies: ['Node.js / Go', 'OAuth2 / PKCE', 'JWT (RS256)', 'Redis (Token Blacklist & Sessions)', 'Argon2id Hashing'],
    responsibilities: [
      'Token issuance, refresh rotation, and revocation checking via distributed cache.',
      'Enforcing RBAC permissions for Guests, Property Hosts, and Platform Admins.',
      'Rate-limiting brute force authentication attempts with Redis sliding windows.',
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/auth/register', desc: 'Creates user account with Argon2id hashed password' },
      { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticates and returns signed RS256 JWT access and refresh tokens' },
      { method: 'POST', path: '/api/v1/auth/magic-link', desc: 'Dispatches passwordless one-time cryptographic sign-in link' },
      { method: 'GET', path: '/api/v1/auth/oauth/:provider', desc: 'Social OAuth 2.0 PKCE authentication handshake' },
    ],
    resiliencePattern: 'Circuit Breaker for 3P Identity Providers, Redis failover cluster with Read Replicas.',
  },
  {
    name: 'Property & Search Engine',
    category: 'Spatial & Search',
    description: 'Powers sub-50ms fuzzy text search, geo-distance radius filtering, and real-time faceted queries across millions of listings worldwide.',
    technologies: ['Elasticsearch 8 / OpenSearch', 'PostGIS', 'Node.js / Express', 'Redis Geospatial'],
    responsibilities: [
      'Synchronizes PostgreSQL property/room changes via Change Data Capture (Debezium + Kafka).',
      'Executes compound queries (geo-polygon bounding boxes, dates, price ranges, star ratings).',
      'Calculates dynamic distance to city centers, airports, and major tourist attractions.',
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/properties/search', desc: 'Spatial and faceted search with price ranges, amenities, and dates' },
      { method: 'GET', path: '/api/v1/properties/:id', desc: 'Fetches comprehensive property details, room inventory, and category scores' },
      { method: 'GET', path: '/api/v1/destinations/top', desc: 'Retrieves trending global travel destinations with aggregate counts' },
    ],
    resiliencePattern: 'Elasticsearch cluster with multi-AZ replica shards; fallback to PostgreSQL PostGIS spatial indexes.',
  },
  {
    name: 'Booking & Inventory Engine',
    category: 'Core Transactional',
    description: 'Transaction-safe reservation state machine utilizing PostgreSQL row-level locks (SELECT FOR UPDATE) and Redis distributed mutexes (Redlock) to mathematically prevent double-booking.',
    technologies: ['PostgreSQL 16 ACID', 'Redis Distributed Lock (Redlock)', 'BullMQ Message Queue', 'Node.js Worker Pool'],
    responsibilities: [
      'Acquires row-level pessimistic locks on room inventory during the 15-minute checkout reservation hold.',
      'Atomically decrements available room inventory and commits booking in a single database transaction.',
      'Schedules TTL expiration jobs that auto-release holds if payment is not confirmed within window.',
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/bookings/hold', desc: 'Initiates 15-minute transactional inventory hold for checkout' },
      { method: 'POST', path: '/api/v1/bookings/confirm', desc: 'Finalizes booking upon verified payment authorization' },
      { method: 'PATCH', path: '/api/v1/bookings/:id/modify', desc: 'Recalculates date modifications and updates reservation' },
      { method: 'POST', path: '/api/v1/bookings/:id/cancel', desc: 'Executes policy-based cancellation and triggers refund pipeline' },
    ],
    resiliencePattern: 'Serializable isolation level for financial transactions, distributed locking with auto-expiry.',
  },
  {
    name: 'Payment & Webhook Ledger',
    category: 'Fintech & Compliance',
    description: 'Processes multi-currency transactions via PCI-DSS compliant payment gateways (Stripe, PayPal, Apple Pay, Local Payment rails) with idempotent webhook ingestion and double-entry ledger bookkeeping.',
    technologies: ['Stripe SDK & Elements', 'Idempotency Keys (UUIDv4)', 'Webhook Signature Verification', 'PostgreSQL Ledger'],
    responsibilities: [
      'Generates client payment intents and executes 3D Secure / Strong Customer Authentication (SCA).',
      'Guarantees at-least-once webhook processing with deduplication tables to avoid double charging.',
      'Handles automatic refund calculation and currency exchange conversion tracking.',
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/payments/create-intent', desc: 'Creates multi-currency payment intent with metadata' },
      { method: 'POST', path: '/api/v1/payments/webhook', desc: 'Signed gateway webhook listener with idempotency verification' },
      { method: 'POST', path: '/api/v1/payments/:id/refund', desc: 'Issues full or partial refunds back to original payment instrument' },
    ],
    resiliencePattern: 'Idempotent transaction logs, exponential backoff webhook retry queue, dead-letter queues (DLQ).',
  },
  {
    name: 'Notification & Voucher Service',
    category: 'Communications',
    description: 'Asynchronous event consumer orchestrating transactional emails (SendGrid), SMS / WhatsApp reminders (Twilio), PDF booking voucher rendering, and iCalendar (.ics) generation.',
    technologies: ['SendGrid API', 'Twilio API', 'Puppeteer / PDFKit', 'Apache Kafka / RabbitMQ', 'iCal Generator'],
    responsibilities: [
      'Renders branded PDF vouchers with QR check-in codes and printable travel itineraries.',
      'Generates RFC-5545 compliant .ics calendar attachments for Apple Calendar, Google Calendar, and Outlook.',
      'Dispatches instant push alerts for date modifications, check-in reminders, and host notices.',
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/notifications/voucher', desc: 'Renders and generates high-res PDF voucher attachment' },
      { method: 'POST', path: '/api/v1/notifications/calendar', desc: 'Builds downloadable .ics calendar invite' },
      { method: 'POST', path: '/api/v1/notifications/email-dispatch', desc: 'Dispatches templated multilingual transactional emails' },
    ],
    resiliencePattern: 'Dead-letter queues, automated SMTP fallback, rate-throttling per communication provider.',
  },
];

export const POSTGRES_DDL_SCHEMA = `-- ====================================================================
-- AURA STAY GLOBAL: PRODUCTION POSTGRESQL RELATIONAL SCHEMA
-- Version: 3.4.0 (Enterprise Multi-Tenant & Spatial Ready)
-- ====================================================================

-- 1. Enable PostGIS & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. User Roles Enum
CREATE TYPE user_role AS ENUM ('guest', 'host', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'paid', 'refunded', 'failed');
CREATE TYPE property_type AS ENUM ('Hotel', 'Apartment', 'Villa', 'Resort', 'Guest House');

-- 3. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role user_role DEFAULT 'guest' NOT NULL,
    avatar_url TEXT,
    loyalty_tier VARCHAR(50) DEFAULT 'Genius Level 1',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type property_type NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(150),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    geom GEOMETRY(Point, 4326),
    rating NUMERIC(3, 2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    star_rating SMALLINT CHECK (star_rating BETWEEN 1 AND 5),
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_genius_discount BOOLEAN DEFAULT FALSE,
    free_cancellation BOOLEAN DEFAULT TRUE,
    check_in_time VARCHAR(10) DEFAULT '15:00',
    check_out_time VARCHAR(10) DEFAULT '11:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Rooms Table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_type VARCHAR(150) NOT NULL,
    description TEXT,
    base_price_per_night NUMERIC(12, 2) NOT NULL,
    max_adults SMALLINT DEFAULT 2 NOT NULL,
    max_children SMALLINT DEFAULT 0 NOT NULL,
    bed_configuration VARCHAR(150) NOT NULL,
    room_size_m2 INTEGER,
    total_inventory INTEGER NOT NULL CHECK (total_inventory >= 0),
    meal_inclusion VARCHAR(100) DEFAULT 'Room Only',
    cancellation_policy TEXT,
    features TEXT[] DEFAULT '{}',
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Bookings Table (Transaction-Safe)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults_count SMALLINT NOT NULL DEFAULT 1,
    children_count SMALLINT NOT NULL DEFAULT 0,
    rooms_count SMALLINT NOT NULL DEFAULT 1,
    base_rate_per_night NUMERIC(12, 2) NOT NULL,
    room_total NUMERIC(12, 2) NOT NULL,
    add_ons_total NUMERIC(12, 2) DEFAULT 0.00,
    taxes_and_fees NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_price NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    status booking_status DEFAULT 'pending' NOT NULL,
    special_requests TEXT,
    traveling_for_work BOOLEAN DEFAULT FALSE,
    hold_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- 7. Payments Table (Idempotent Ledger)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    payment_gateway_ref VARCHAR(255) NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    payment_status payment_status DEFAULT 'pending' NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    failure_reason TEXT,
    raw_gateway_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    rating_score NUMERIC(3, 1) NOT NULL CHECK (rating_score BETWEEN 1.0 AND 10.0),
    cleanliness_score NUMERIC(3, 1) CHECK (cleanliness_score BETWEEN 1.0 AND 10.0),
    location_score NUMERIC(3, 1) CHECK (location_score BETWEEN 1.0 AND 10.0),
    service_score NUMERIC(3, 1) CHECK (service_score BETWEEN 1.0 AND 10.0),
    value_score NUMERIC(3, 1) CHECK (value_score BETWEEN 1.0 AND 10.0),
    traveler_type VARCHAR(50) DEFAULT 'Couple',
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for Ultra-Fast Queries & Row Locking
CREATE INDEX idx_properties_geom ON properties USING GIST (geom);
CREATE INDEX idx_properties_city_country ON properties (city, country);
CREATE INDEX idx_properties_rating ON properties (rating DESC);
CREATE INDEX idx_bookings_dates ON bookings (room_id, check_in_date, check_out_date);
CREATE INDEX idx_bookings_user ON bookings (user_id);
CREATE INDEX idx_payments_booking ON payments (booking_id);
CREATE INDEX idx_reviews_property ON reviews (property_id);
`;

export const DOCKERFILE_CODE = `# ====================================================================
# Multi-Stage Production Dockerfile for AuraStay Services
# ====================================================================

# Stage 1: Build & Prune
FROM node:20-alpine AS builder
WORKDIR /app

# Install system dependencies for native builds
RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Minimal Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Non-root unprivileged security profile
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 aurastay

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

USER aurastay
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.js"]
`;

export const GITHUB_ACTIONS_CI_CD = `# ====================================================================
# GitHub Actions CI/CD Pipeline: AuraStay Enterprise Deployment
# ====================================================================
name: AuraStay CI/CD Enterprise Delivery

on:
  push:
    branches: [main, release/*]
  pull_request:
    branches: [main]

jobs:
  audit-and-test:
    name: Lint, Test & OWASP Security Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Type Check & Lint
        run: npm run lint

      - name: Unit & Integration Tests
        run: npm test -- --coverage --passWithNoTests

      - name: OWASP Dependency Vulnerability Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
        continue-on-error: true

  docker-build-push:
    name: Build & Push Container to AWS ECR
    needs: audit-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build & Tag Multi-Arch Docker Image
        run: |
          docker build -t \${{ steps.login-ecr.outputs.registry }}/aurastay-api:\${{ github.sha }} .
          docker push \${{ steps.login-ecr.outputs.registry }}/aurastay-api:\${{ github.sha }}

      - name: Trigger Rolling Deploy to AWS ECS Fargate
        run: |
          aws ecs update-service --cluster aurastay-prod-cluster \\
            --service aurastay-core-service \\
            --force-new-deployment
`;
