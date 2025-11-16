# 🌍 **Multi-Location & Dive Site Scalability Specification** 🤿📍

## 1. Purpose of This Document 🧭✨
This document outlines how DovyDive will expand to support multiple dive locations and their respective dive sites. It ensures the architecture, user experience, and database model are designed to scale without major structural changes as new locations are added.

---

## 2. Scalability Vision 🌏🚀
DovyDive will grow from a Tioman-only implementation into a multi-destination diving ecosystem. Every location added to the system will include:
- Its own dive sites
- Local species associations
- Educational or travel information
- AI context metadata for RAG

Potential future locations:
- Perhentian Islands
- Redang
- Sipadan
- Bali
- Maldives

---

## 3. Multi-Location Structure 🗺️📍
### 3.1 Location Entity
Each **Location** includes:
- Name (e.g., Tioman)
- Region (e.g., Malaysia East Coast)
- Description
- Hero image
- Common species
- Dive site list
- Optional travel information

### 3.2 Dive Site Entity
Each **Dive Site** belongs to a specific location and includes:
- Name
- Coordinates
- Difficulty level
- Depth range
- Entry type (shore or boat)
- Known species
- Photos
- Safety notes

### 3.3 Species Entity
Each **Species**:
- Exists globally
- Associates with multiple locations
- Maps to individual dive sites

---

## 4. Database Scalability Model 🧱🐠
### Recommended Relational Model
- `locations`
- `dive_sites`
- `species`
- `species_location_map`
- `species_dive_site_map`

### Benefits
- Seamless addition of new locations
- Zero database restructuring as the platform grows
- Species reused across regions without duplication
- Cleaner RAG enrichment through structured location data

---

## 5. Frontend UX for Multi-Location Navigation 🖥️📱
### Recommended User Flow
1. User opens **Location Selection Page** (world map or list format)
2. Selects a desired location
3. Lands on the location’s overview page
4. Navigates to:
   - Dive sites
   - Species map
   - AI assistant
   - Local guides

### Location Overview Page Components
- Hero image
- Short introductory text
- Quick statistics (number of dive sites, species count, difficulty distribution)
- Clear CTAs
- Interactive map

---

## 6. AI Layer Scalability 🤖📚
### Location-Specific RAG
Each location includes:
- Local species metadata
- Dive site descriptions
- Travel and safety notes

The AI assistant must:
- Detect user context automatically
- Switch between location contexts on command
- Filter embedding search by selected location

### Example Queries
- "Where can I see turtles in Perhentian?"
- "Which dive sites in Redang are suitable for beginners?"
- "What’s the difference between Tioman and Sipadan diving?"

---

## 7. Map Scalability 🗺️⚓
A global map interface should support:
### Map States
- **Zoomed out:** high-level location markers
- **Zoomed in:** dive site markers within the chosen location

Clustering should adjust dynamically as more locations are added.

---

## 8. Roadmap for Location Expansion 🚀📌
### Phase A – Multi-Location Framework
- Implement database schema for multi-location support
- Add location selector UI
- Update AI RAG pipeline with per-location context segmentation

### Phase B – Add Second & Third Locations
- Introduce Perhentian and Redang
- Add approximately 10 dive sites per new location
- Update map clustering logic

### Phase C – Global Expansion
- Add international destinations
- Introduce filtering by region, season, and difficulty

---

## 9. Future Extensions 🌟
- User accounts with location-based dive logs
- Location-specific training or certification modules
- Community species photo submissions
- Dive shop listings and recommendations per location

---

# End of Document 🌊📘🌍

