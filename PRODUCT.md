# ImmoApp - Product Specification

> A real estate investment portfolio tracker for private landlords and property investors. Track properties, cashflows, returns, and never miss an important deadline.

---

## Vision

ImmoApp helps property investors manage their portfolio with clarity. See all your properties in one place, understand your real returns, track every euro in and out, and get reminded about important dates - without connecting to banks or generating contracts.

**What it is:** A portfolio dashboard for real estate investors.
**What it is not:** A banking app, a contract generator, or a tenant portal.

---

## User Roles

| Role | Description | Access |
|------|-------------|--------|
| **Investor (Owner)** | Private landlord or investor who owns 1–50+ units. Primary user. | Full access to own portfolio |
| **Advisor** | Tax advisor, accountant, or financial planner invited by the investor. Read-only access to financials and reports. | Shared read-only via invite link |

> **Single-user focus for MVP.** Multi-user collaboration (advisor sharing) comes later via the existing sharing system in the DB schema.

---

## Domain Model

### Core Entities

```
Investor (User)
  └── Portfolio
        └── Property (Immobilie)
              ├── Units (Einheiten)
              │     ├── Tenancy (Mietverhältnis)
              │     │     ├── Tenant info (name only, no sensitive data)
              │     │     ├── Rent amount (Kaltmiete / Warmmiete)
              │     │     ├── Start / end date
              │     │     └── Rent adjustment history
              │     └── Vacancy periods
              ├── Transactions (Buchungen)
              │     ├── Income (Mieteinnahmen, Sonderzahlungen)
              │     └── Expenses (Hausgeld, Reparaturen, Versicherung, Grundsteuer, ...)
              ├── Documents (Dokumente) - file uploads (photos, PDFs)
              └── Events (Termine / Fristen)
                    ├── Recurring (e.g. Nebenkostenabrechnung deadline)
                    ├── One-time (e.g. Grundsteuer payment)
                    └── Reminders (X days before due)

Key Metrics (calculated, not stored):
  ├── Cashflow (Einnahmen − Ausgaben)
  ├── Net Operating Income (NOI)
  ├── Gross yield (Bruttorendite)
  ├── Net yield (Nettorendite)
  ├── Cash-on-cash return
  ├── Vacancy rate
  └── Total portfolio value
```

### Entity Details

#### Property (Immobilie)

| Field | Type | Description |
|-------|------|-------------|
| name | string | Display name (e.g. "Altbauwohnung Prenzlauer Berg") |
| type | enum | `apartment`, `house`, `multi_family`, `commercial`, `garage`, `land` |
| address | object | Street, house number, PLZ, city, state, country |
| purchasePrice | decimal | Original acquisition price |
| purchaseDate | date | Acquisition date |
| purchaseCosts | decimal | Notary, tax, agent fees (Kaufnebenkosten) |
| currentValue | decimal | Estimated current market value (manually entered) |
| livingArea | decimal | m² living/usable area |
| plotArea | decimal | m² land area (if applicable) |
| constructionYear | integer | Year built |
| numberOfUnits | integer | Number of rentable units |
| notes | text | Free-form notes |
| imageUrl | string | Main property photo |

#### Unit (Einheit)

| Field | Type | Description |
|-------|------|-------------|
| name | string | Unit identifier (e.g. "EG links", "Wohnung 3", "Garage 1") |
| type | enum | `residential`, `commercial`, `parking`, `storage`, `other` |
| area | decimal | m² area |
| rooms | decimal | Number of rooms (e.g. 2.5) |
| floor | string | Floor level (e.g. "EG", "1. OG", "DG") |
| status | enum | `occupied`, `vacant`, `renovation`, `owner_use` |

#### Tenancy (Mietverhältnis)

| Field | Type | Description |
|-------|------|-------------|
| tenantName | string | Tenant display name (no sensitive data) |
| coldRent | decimal | Kaltmiete (net rent) per month |
| utilities | decimal | Nebenkosten (utilities advance) per month |
| totalRent | decimal | Warmmiete (cold + utilities) per month |
| startDate | date | Lease start date |
| endDate | date | Lease end date (null = indefinite) |
| depositAmount | decimal | Kaution amount |
| notes | text | Free-form notes |

#### Transaction (Buchung)

| Field | Type | Description |
|-------|------|-------------|
| date | date | Transaction date |
| type | enum | `income` or `expense` |
| category | enum | See categories below |
| amount | decimal | Amount in EUR (always positive, sign determined by type) |
| description | string | Short description |
| recurring | boolean | Is this a recurring transaction? |
| recurrenceInterval | enum | `monthly`, `quarterly`, `yearly` (if recurring) |

**Income categories:**
- `rent` - Mieteinnahme
- `utilities_settlement` - Nebenkostenrückzahlung
- `deposit` - Kautionseinzahlung
- `other_income` - Sonstige Einnahmen

**Expense categories:**
- `hausgeld` - Hausgeld / WEG-Verwaltung
- `property_tax` - Grundsteuer
- `insurance` - Versicherungen
- `maintenance` - Instandhaltung / Reparaturen
- `utilities` - Nebenkosten / Betriebskosten
- `management_fee` - Verwaltungskosten
- `mortgage_interest` - Darlehenszinsen (tracking only, no bank connection)
- `mortgage_principal` - Tilgung (tracking only)
- `depreciation` - AfA (Abschreibung)
- `vacancy_costs` - Leerstandskosten
- `legal` - Rechtskosten
- `other_expense` - Sonstige Ausgaben

#### Event (Termin / Frist)

| Field | Type | Description |
|-------|------|-------------|
| title | string | Event title |
| type | enum | See event types below |
| dueDate | date | Due / target date |
| isRecurring | boolean | Repeats annually? |
| reminderDays | integer | Remind X days before due date |
| status | enum | `upcoming`, `done`, `overdue` |
| notes | text | Additional details |

**Event types (Terminarten):**
- `nebenkostenabrechnung` - Nebenkostenabrechnung erstellen (annual, due by Dec 31)
- `tax_declaration` - Steuererklärung / Anlage V
- `property_tax_payment` - Grundsteuer-Zahlung (quarterly)
- `insurance_renewal` - Versicherung prüfen/erneuern
- `rent_increase` - Mieterhöhung möglich (Mietspiegel check)
- `lease_end` - Mietvertrag läuft aus
- `maintenance_scheduled` - Geplante Instandhaltung
- `hausgeld_review` - Hausgeld-Abrechnung prüfen
- `property_valuation` - Marktwert neu bewerten
- `custom` - Benutzerdefiniert

---

## Features - Full Specification

### Phase 1: Portfolio Foundation (MVP)

#### F1.1 - Property Management
- CRUD for properties with all fields above
- Property detail page with summary card (address, value, yield, cashflow)
- Property list with search, filter by type, sort by value/yield
- Property photo upload (single main image)

#### F1.2 - Unit Management
- CRUD for units within a property
- Unit list on property detail page
- Status indicator (occupied / vacant / renovation / owner use)
- Quick overview: area, rooms, floor, current tenant, current rent

#### F1.3 - Tenancy Tracking
- CRUD for tenancies within a unit
- Current + historical tenancies (timeline view)
- Rent amount tracking (Kaltmiete / Nebenkosten / Warmmiete)
- Vacancy period tracking (gaps between tenancies)
- Rent adjustment history (Mietanpassungen)

#### F1.4 - Transaction Tracking (Cashflow)
- CRUD for income and expense transactions per property
- Categorized with predefined categories (see above)
- Monthly / yearly aggregation
- Recurring transactions (auto-generate monthly/quarterly/yearly entries)
- Bulk entry: quick-add for multiple months of the same transaction
- Filter by property, category, date range, type

#### F1.5 - Dashboard (Portfolio Overview)
- Total portfolio value (sum of all property `currentValue`)
- Total monthly cashflow (income − expenses)
- Total vacancy rate
- Property cards with key metrics
- Recent transactions list
- Upcoming events / deadlines

### Phase 2: Analytics & Metrics

#### F2.1 - Property Analytics
- Per-property cashflow chart (monthly bar chart, income vs expenses)
- Yield calculation:
  - **Bruttorendite** = (annual Kaltmiete / purchase price) × 100
  - **Nettorendite** = (annual NOI / total investment) × 100
  - **Cash-on-cash** = (annual cashflow / equity invested) × 100
- Expense breakdown (pie chart by category)
- Occupancy rate (occupied months / total months)
- Rent per m² comparison

#### F2.2 - Portfolio Analytics
- Portfolio value over time (line chart)
- Monthly cashflow trend (all properties combined)
- Best/worst performing properties
- Diversification view (by type, location)
- Year-over-year comparison

#### F2.3 - Nebenkostenabrechnung Helper
- Annual utility cost calculation per unit
- Actual costs vs. advance payments (Vorauszahlungen)
- Per-tenant settlement amount (Nachzahlung / Guthaben)
- Printable summary (not a legal document, just a calculation aid)

### Phase 3: Events & Reminders

#### F3.1 - Event Calendar
- Calendar view of all upcoming events
- List view with filtering by type, property, status
- Color-coded by type and urgency
- Overdue event highlighting

#### F3.2 - Reminders
- In-app notification banner for upcoming events
- Email reminders (when Resend is configured)
- Auto-generate recurring events:
  - Nebenkostenabrechnung (annually, Dec 31)
  - Grundsteuer (quarterly)
  - Insurance renewal (annually)

#### F3.3 - Smart Suggestions
- "Rent increase possible" - when 15 months since last increase (§558 BGB)
- "Nebenkostenabrechnung overdue" - when past Dec 31 deadline
- "Vacancy alert" - when a unit has been vacant > 30 days

### Phase 4: Documents & Reports

#### F4.1 - Document Management
- Upload PDFs, images per property or unit
- Categorize: contract, photo, invoice, insurance, tax, other
- Simple file list with download
- No preview needed - just storage and organization

#### F4.2 - Export / Reports
- CSV export: transactions, properties, units
- Annual summary report per property (PDF)
- Tax helper: Anlage V data compilation (income + deductible expenses)
- Portfolio snapshot export

### Phase 5: Advanced Features

#### F5.1 - Advisor Sharing
- Share portfolio read-only with tax advisor via invite link
- Uses existing `resource_shares` + `share_invites` DB tables
- Advisor sees properties, transactions, reports - cannot edit

#### F5.2 - Multi-Currency (optional)
- Support for properties in different countries/currencies
- Exchange rate for portfolio totalssummary

#### F5.3 - Goal Tracking
- Set financial goals (e.g. "€5,000/month passive income")
- Progress visualization
- Projected timeline based on current growth

---

## UI Structure

```
/ (Marketing)
├── Landing page - hero, features, pricing
├── /pricing - plan tiers
└── /blog - content marketing

/dashboard
├── Overview - portfolio summary, stats, charts, upcoming events
├── /properties
│     ├── List - all properties, search/filter/sort
│     └── /[id] - property detail
│           ├── Overview tab - key metrics, value, yield
│           ├── Units tab - unit list, tenancy info
│           ├── Cashflow tab - transactions, charts
│           ├── Events tab - deadlines for this property
│           └── Documents tab - file uploads
├── /cashflow - global transaction view across all properties
├── /calendar - all events, deadlines, reminders
├── /reports - analytics, charts, exports
└── /settings - profile, security, preferences
```

---

## Data Privacy & Security Principles

- **No bank connections** - all financial data is manually entered
- **No sensitive tenant data** - only name for display, no ID numbers or bank details
- **No contract generation** - the app is a tracker, not a legal tool
- **User owns their data** - full export capability (CSV)
- **Minimal PII** - only user email + name for auth; tenant names stored but no further personal data
- **GDPR compliant** - account deletion removes all data (already implemented)

---

## Technical Implementation Notes

### Database Schema Changes Needed

Replace the generic `collections` + `notes` tables with:

```
properties        - Property/Immobilie
units             - Units within a property
tenancies         - Tenant periods per unit
transactions      - Income/expense records
events            - Deadlines and reminders
documents         - File metadata (storage TBD)
rent_adjustments  - Mietanpassung history
```

Keep existing: `user`, `session`, `account`, `verification`, `resource_shares`, `share_invites`

### i18n Additions

Extend `en.json` and `de.json` with domain-specific namespaces:
- `properties` - property-related labels
- `units` - unit-related labels
- `tenancies` - tenancy/tenant labels
- `transactions` - income/expense categories and labels
- `events` - event types and calendar labels
- `reports` - analytics and export labels
- `cashflow` - financial metric labels

German terminology is critical - users will expect proper German real estate vocabulary (Kaltmiete, Warmmiete, Hausgeld, Nebenkosten, etc.).

### File Storage

Documents/photos can use:
- **Local filesystem** (dev/self-hosted)
- **S3-compatible storage** (Cloudflare R2, AWS S3, Hetzner Object Storage)
- Implementation deferred to Phase 4

### Charts

Use `recharts` (already installed) for:
- Cashflow bar charts
- Yield trend lines
- Expense breakdowns (pie/donut)
- Portfolio value timeline

---

## Migration Path from Starter

1. **Keep:** Auth, dashboard shell, sidebar, i18n system, theme, settings, marketing pages
2. **Replace:** Collections CRUD → Properties CRUD (similar pattern, different schema)
3. **Replace:** Notes CRUD → Transactions CRUD (within property context)
4. **Add:** Units, Tenancies, Events, Documents, Reports
5. **Evolve:** Dashboard stats → real portfolio metrics

The starter's Collections + Notes serve as a **working reference** for the CRUD pattern. Each new entity follows the same architecture:
- Drizzle schema → Migration → Query helpers → API routes → React Query hooks → UI components → i18n keys

---

## Milestones

| Milestone | Features | Target |
|-----------|----------|--------|
| **M1 - Property CRUD** | Properties, units, basic detail pages | Week 1–2 |
| **M2 - Tenancy & Rent** | Tenancies, rent tracking, vacancy | Week 3–4 |
| **M3 - Cashflow** | Transactions, categories, recurring, monthly view | Week 5–6 |
| **M4 - Dashboard Metrics** | Portfolio overview, yields, charts | Week 7–8 |
| **M5 - Events & Calendar** | Events, reminders, Nebenkostenabrechnung helper | Week 9–10 |
| **M6 - Documents & Export** | File uploads, CSV export, reports | Week 11–12 |
| **M7 - Polish & Launch** | Onboarding, mobile responsiveness, performance | Week 13–14 |
