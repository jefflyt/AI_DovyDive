# 🌊 DovyDive – Final Technical Specification (Multi-Location, Multi-Agent)

This document consolidates the technical decisions and defines the architecture, data model, APIs, and multi-agent AI design for DovyDive.

---

## 1. Scope & Priorities

### 1.1 MVP Scope (Phase 1)
Priority ranking (from user): **d, a, c, b, e**

**Must-have (Phase 1)**
1. **AI Dive Assistant (multi-agent)**
2. **Landing page + core static content**
3. **Interactive map with filters**
4. **Location + dive-site + species browsing**
5. **User accounts (basic)**

**Deferred to Phase 2+**
- Rich admin CMS-like interface
- Multi-location expansion beyond initial 3 Malaysian locations
- Advanced analytics and reporting

### 1.2 Multi-Location Vision
- Phase 1: Tioman (primary)
- First 6 months: expand to 3 Malaysian locations total.
- Architecture is multi-location from day one; locations and dive sites are data-driven, not hard-coded.

---

## 2. High-Level Architecture

### 2.1 Tech Stack Summary
- **Frontend**: React + Next.js (TypeScript)
- **Backend / API & AI Orchestrator**: Python + FastAPI
- **Monorepo**: Shared repository for frontend, backend, and infra configs
- **Database & Auth**: PostgreSQL via Supabase (primary DB)
- **Vector Store**: Supabase Vector
- **LLM Provider**: Groq (best available model at time of implementation)
- **Hosting**:
  - Web frontend: Vercel or Render (cost-optimized)
  - Backend API + AI services: Render
  - Database + Auth + Storage + Vector: Supabase

> Note: User mentioned "front end as NestJS" – NestJS is a backend framework. For frontend we standardize on **Next.js**.

### 2.2 Logical Layers
1. **Presentation Layer (Next.js)**
   - Pages: Landing, Locations, Dive Sites, Species, Map, Chat
   - Authentication UI (Supabase Auth integration)
2. **API Layer (FastAPI)**
   - REST endpoints for locations, dive sites, species, and content
   - Authentication & authorization middleware (JWT from Supabase)
3. **AI Layer (FastAPI service)**
   - Multi-agent orchestrator
   - Tools for DB access, vector search, and external calls (future)
4. **Data Layer (Supabase Postgres + Vector)**
   - Relational schema for locations, dive sites, species, content, users, contributions
   - Vector store for RAG documents

---

## 3. Frontend Architecture

### 3.1 Framework & Libraries
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI / Radix UI
- **State/Data fetching**: React Query (TanStack Query)
- **Maps**: Mapbox GL JS or React Leaflet + OpenStreetMap
- **Forms**: React Hook Form
- **Auth**: Supabase Auth client SDK

### 3.2 Core Routes (Phase 1)
- `/` – Landing page (intro, location highlight, CTA to Map & AI)
- `/locations` – Location list (if >1 location) or redirect to Tioman
- `/locations/[slug]` – Location overview (Tioman, etc.)
- `/locations/[slug]/map` – Map with filters for dive sites & species
- `/sites/[slug]` – Dive site detail page
- `/species` – Species index/search
- `/species/[id-or-slug]` – Species detail page
- `/chat` – AI Dive Assistant
- `/login`, `/signup`, `/account` – User auth & profile (Phase 1 minimal)

### 3.3 Frontend–Backend Integration
- All data from **FastAPI** via **REST JSON** under `/api/v1/...`.
- Authenticated requests include Supabase JWT in `Authorization: Bearer <token>`.
- Chat uses:
  - `POST /api/v1/chat` for message
  - Optional streaming via SSE or WebSockets

- `Telegram Bot`: Provide a Telegram bot webhook (e.g. `POST /api/v1/telegram/webhook`) that forwards user messages and commands to the AI orchestrator. The bot should support simple commands to set `location` (e.g. `/location tioman`), request site/species info (e.g. `/site [slug]`, `/species [name]`), and surface short RAG-grounded answers. Support optional account-linking (map Telegram user to Supabase user), enforce webhook secret verification, rate limiting, and reply via the Telegram API.

---

## 4. Backend Architecture (FastAPI)

### 4.1 Services
Single codebase, separated into modules:
- `core` – config, logging, security
- `models` – SQLAlchemy models / Pydantic schemas
- `routes` – REST endpoints
- `services` – business logic
- `ai` – multi-agent orchestrator and tools

### 4.2 REST API Overview (v1)
_Base path: `/api/v1`_

#### 4.2.1 Public Read Endpoints
- `GET /health` – Service health check
- `GET /locations` – List locations
- `GET /locations/{id_or_slug}` – Location details
- `GET /locations/{id_or_slug}/sites` – Dive sites for location
- `GET /sites/{id_or_slug}` – Dive site details
- `GET /species` – List/filter species
- `GET /species/{id_or_slug}` – Species details
- `GET /content/{topic}` – Static content blocks (e.g., beginner guide)

#### 4.2.2 User & Contribution (Authenticated)
- `GET /me` – Current user profile
- `GET /me/favorites` – (Phase 2) Favorite sites/species
- `POST /contributions/species` – User-submitted species sighting/info (Phase 1 basic schema)
- `POST /contributions/sites` – User-submitted dive site notes

#### 4.2.3 AI Chat
- `POST /chat`
  - Body: `{ session_id, user_id (optional), message, location_context?, site_context? }`
  - Returns: `{ messages: [...], agent_trace?: ... }`

#### 4.2.4 Admin (Phase 2+)
- `POST /admin/locations`
- `POST /admin/sites`
- `POST /admin/species`
- `POST /admin/content`
- `PUT /admin/...`
- Protected via RBAC; limited to admin users.

### 4.3 Security
- JWT verification via Supabase public key.
- Role-based access for `/admin/*`.
- Rate limiting on `/chat` and contribution endpoints.

---

## 5. Data Model (Supabase Postgres)

### 5.1 Core Tables

**`locations`**
- `id` (PK, UUID)
- `slug` (text, unique)
- `name` (text)
- `country` (text)
- `region` (text)
- `description` (text)
- `hero_image_url` (text)
- `lat` (numeric) – optional centroid
- `lng` (numeric)
- `is_active` (bool)

**`dive_sites`**
- `id` (PK, UUID)
- `location_id` (FK → locations.id)
- `slug` (text, unique per location)
- `name` (text)
- `description` (text)
- `lat` (numeric)
- `lng` (numeric)
- `min_depth_m` (int)
- `max_depth_m` (int)
- `difficulty` (enum: BEGINNER, INTERMEDIATE, ADVANCED)
- `entry_type` (enum: SHORE, BOAT)
- `safety_notes` (text)
- `is_active` (bool)

**`species`**
- `id` (PK, UUID)
- `slug` (text, unique)
- `common_name` (text)
- `scientific_name` (text)
- `type` (enum: FISH, CORAL, TURTLE, SHARK, INVERTEBRATE, OTHER)
- `rarity` (enum: COMMON, OCCASIONAL, RARE)
- `min_depth_m` (int)
- `max_depth_m` (int)
- `behavior` (text)
- `conservation_status` (text)
- `image_url` (text)

**`species_location_map`**
- `id` (PK, UUID)
- `species_id` (FK → species.id)
- `location_id` (FK → locations.id)

**`species_dive_site_map`**
- `id` (PK, UUID)
- `species_id` (FK → species.id)
- `dive_site_id` (FK → dive_sites.id)

**`content_blocks`** (for RAG + site content)
- `id` (PK, UUID)
- `location_id` (FK → locations.id, nullable)
- `topic` (text – e.g., `beginner_guide`, `equipment_basics`, `safety`)
- `title` (text)
- `markdown_body` (text)
- `last_updated` (timestamp)

**`users`**
- Linked to Supabase Auth user table; app table stores profile fields.
- `id` (PK, UUID, same as auth UID)
- `display_name` (text)
- `created_at` (timestamp)

**`user_contributions`**
- `id` (PK, UUID)
- `user_id` (FK → users.id)
- `type` (enum: SPECIES_SIGHTING, SITE_NOTE)
- `location_id` (FK → locations.id)
- `dive_site_id` (FK → dive_sites.id, nullable)
- `species_id` (FK → species.id, nullable)
- `title` (text)
- `body` (text)
- `image_url` (text, nullable)
- `status` (enum: PENDING, APPROVED, REJECTED)
- `created_at` (timestamp)

**`chat_sessions`** (optional, Phase 1 light)
- `id` (PK, UUID)
- `user_id` (FK → users.id, nullable)
- `location_id` (FK → locations.id, nullable)
- `created_at` (timestamp)

**`chat_messages`**
- `id` (PK, UUID)
- `session_id` (FK → chat_sessions.id)
- `sender` (enum: USER, ASSISTANT, SYSTEM)
- `content` (text)
- `role_metadata` (JSONB – which agent responded)
- `created_at` (timestamp)

### 5.2 Vector Store Schema (Supabase Vector)

**`documents`**
- `id` (PK, UUID)
- `location_id` (FK → locations.id, nullable)
- `doc_type` (text: GUIDE, SITE, SPECIES, FAQ)
- `ref_table` (text: `content_blocks`, `dive_sites`, `species`)
- `ref_id` (UUID)
- `content` (text)
- `embedding` (vector)

---

## 6. AI & Multi-Agent Architecture (Groq-backed)

### 6.1 Objectives
- Use a **multi-agent system** orchestrated by a central “brain” LLM.
- Provide **knowledge**, not prescriptive safety/medical advice.
- Keep costs low with **model tiering**: cheap model for classification/routing, stronger model for final responses.

### 6.2 Orchestration
- Implemented in Python using a graph/agent framework (LangGraph-style) or custom orchestrator.
- Central **Orchestrator (Brain)** agent decides:
  - What the user is asking
  - Which specialist agents to call
  - In what order
  - How to merge results

### 6.3 Agent List (Full Set)

1. **Orchestrator / Brain Agent**
   - Role: High-level controller.
   - Uses Groq LLM to parse user intent and select tools/agents.
   - Decides when to call RAG, DB tools, or hand off to specialist agents.

2. **Location & Dive-Site Expert Agent**
   - Tools:
     - `tool_get_locations()`
     - `tool_get_dive_sites(location_id, filters)`
     - `tool_get_dive_site_details(site_id)`
     - Vector search over site descriptions.
   - Handles: "Where can I dive as a beginner in Tioman?", "Compare Site A vs Site B".

3. **Species & Marine Life Expert Agent**
   - Tools:
     - `tool_get_species_by_name(name)`
     - `tool_search_species(filters)`
     - Vector search across species docs.
   - Handles: "Where can I see turtles in Malaysia?", "What is the behavior of [species]?".

4. **New Diver Education Agent**
   - RAG over `content_blocks` for beginner topics.
   - Provides structured explanations: certification path, skills, basic concepts.

5. **Equipment Advisor Agent**
   - Uses rules + RAG over `content_blocks` like `equipment_basics`.
   - Handles: "What gear do I need for my first open water course?".

6. **Safety & Guardrail Agent**
   - Final check layer for responses related to safety and health.
   - Rules:
     - Do not give medical advice.
     - Do not specify depth/time limits beyond generic training standards.
     - Always recommend consulting a dive professional for anything risk-related.
   - Can modify or block unsafe suggestions.

7. **Knowledge Grounding / RAG Agent**
   - Responsible for all vector DB queries.
   - Offers tools like `tool_rag_search(query, location_id)`.
   - Used by other agents instead of each directly implementing vector logic.

8. **Response Styler Agent** (Optional but recommended)
   - Takes a structured answer and makes it concise and user-friendly.
   - Keeps tone informative, not alarmist.

9. **Contribution & Feedback Agent** (Phase 2+)
   - Helps process user contributions.
   - Suggests normalization or flags low-quality / suspicious input.

### 6.4 Model Strategy (Groq)
- **Router/Orchestrator**: Smaller/faster Groq-hosted model for intent classification and tool planning.
- **Specialist Responses**: Stronger Groq model for final answer synthesis.
- Embeddings: Chosen embedding model accessible via Groq or fallback to OpenAI if needed (implementation detail).

### 6.5 Chat Flow (Pseudo-code)

```python
# High-level flow for POST /chat

request = ChatRequest(...)

# 1. Initialize context
session = get_or_create_session(request.session_id, request.user_id)

# 2. Orchestrator determines intent
intent = orchestrator_model.classify_intent(request.message, history=session.history)

# 3. Select agents based on intent
agents = planner.select_agents(intent)

intermediate_results = []

for agent in agents:
    result = agent.handle(request, session, intermediate_results)
    intermediate_results.append({"agent": agent.name, "result": result})

# 4. Aggregate and style
raw_answer = aggregate_results(intermediate_results)

safe_answer = safety_agent.review(raw_answer, context=request)

final_answer = styler_agent.rewrite(safe_answer)

# 5. Persist and respond
save_chat_message(session, sender="USER", content=request.message)
save_chat_message(session, sender="ASSISTANT", content=final_answer)

return ChatResponse(message=final_answer, trace=intermediate_results)
```

Channels: The orchestrator should support multiple channels (web chat, mobile, and Telegram). When the incoming message `source` is `TELEGRAM`, the system should:
- verify the webhook signature/secret,
- include `telegram.user_id` in session/context,
- process the message the same way as a web chat message, and
- send the response back through the Telegram Bot API (including handling messages longer than Telegram limits, sending attachments or quick-reply buttons where appropriate).

The Telegram integration should be implemented as a lightweight webhook handler that delegates to the same orchestrator pipeline so behavior and guardrails remain consistent across channels.

---

## 7. Deployment & Infrastructure

### 7.1 Phase 1 (Cost-Optimized)
- **Frontend**:
  - Next.js on Vercel *or* Render static/SSR deployment.
- **Backend + AI**:
  - FastAPI app on Render (single service initially).
  - Scale to separate services (API vs AI) only if needed.
- **Database**:
  - Supabase free/low-tier project (Postgres + Auth + Storage + Vector).
- **Budget target**: < USD 50/month for infra + AI during early testing.

### 7.2 Environments
- `dev` – local + dev Supabase project, minimal Groq usage.
- `prod` – single production environment, manual deployments initially.

---

## 8. Observability & Analytics

### 8.1 Logging & Metrics
- Use structured JSON logs in FastAPI (request ID, path, status, latency).
- Basic metrics:
  - Number of chat sessions.
  - AI token usage per day.
  - Top intents (via simple aggregation).

### 8.2 Analytics
- Web analytics: **simple privacy-friendly tool** (Plausible, Umami, or Vercel Analytics).
- Track:
  - Page views (landing, map, chat).
  - Clicks on "Ask AI" and map filters.

---

## 9. Admin & CMS Plan

### 9.1 Phase 1
- No full CMS UI.
- Data entry through:
  - Supabase SQL editor
  - Seed scripts / CSV import
- You author content yourself (Markdown in `content_blocks`).

### 9.2 Phase 2
- Build an internal **admin UI** (CMS-like) within the same monorepo:
  - Protected route: `/admin`
  - Features:
    - CRUD for locations, sites, species
    - Content editor for `content_blocks` (Markdown editor)
    - Review & approve user contributions

---

## 10. Roadmap (Technical)

### Phase 1 – MVP (Tioman)
- Implement DB schema & migrations.
- Seed Tioman + initial species + 5–10 dive sites.
- Ingest core content (beginner guide, equipment basics, safety overview).
- Set up embeddings & RAG for content and key sites/species.
- Implement FastAPI REST endpoints (read-only + minimal contributions).
- Implement full multi-agent chat for:
  - new diver questions
  - Tioman dive-site queries
  - species questions
- Build frontend (landing, Tioman overview, map, chat).
- Add Supabase Auth and basic user accounts.

### Phase 2 – Expansion & CMS
- Add 2 more Malaysian locations + sites.
- Implement `/locations` selector and multi-location map.
- Build admin CMS UI for locations/sites/species/content.
- Upgrade analytics and logging.
- Enhance contribution flows and moderation tools.

### Phase 3 – Advanced Features
- More locations (beyond Malaysia).
- Offline-friendly mobile app (React Native) using same backend.
- Richer user profiles (favorites, personal logs).
- External integrations (weather, tide, boat schedules) via new agents.

---

# End of Technical Specification 🌊📘

