# The Investor's Chronicle & Meridian Prime Setup Guide

This guide provides a comprehensive technical overview of the application architecture, the newspaper index page, the enquiry page, the contact form validation systems, API serverless configurations, CRM integration, Vercel Blob storage, and development bugs resolved.

---

## 1. Application Architecture

The application is built using the **TanStack Start** framework on top of **React** and **Vite**. 
- It uses file-based routing handled by TanStack Router.
- The styling system is built using vanilla **Tailwind CSS (v4)** for maximum design flexibility and custom animations.
- The project is configured to run serverless functions (using `@vercel/node`) in the production environment on Vercel, and a local simulated API server (`api-dev-server.ts`) for local development.

### Development Workflow & hot-reloads
The local development server runs concurrently under `npm run dev`:
- **Vite Client Server**: Runs on `http://localhost:5173`.
- **API Dev Server**: Runs on `http://localhost:3001` via `tsx --watch api-dev-server.ts`. The `--watch` flag ensures that the server automatically reloads whenever changes are made to backend controllers or configurations.

---

## 2. News Index Page (`src/pages/Index.tsx` / `/` Route)

The landing page represents a premium financial news publication: **The Investor's Chronicle**.

### Typography Design
- **Headlines & Subheadings**: Styled using the **Playfair Display** serif font (`'Playfair Display', Georgia, serif`). This gives the article titles a classic, high-end editorial feel.
- **Article Body Text**: Styled using the **Inter** sans-serif font (`'Inter', sans-serif`) for clean, crisp, and high-readability text blocks on all screen sizes.
- **Favicon**: Configured a custom vector monogram SVG favicon (`public/favicon.svg`) containing a luxury dark rounded background and a serif `"I"` monogram.

### Responsive Tickers
To capture user engagement, two horizontal ticker bars are rendered above the main article:
1. **IN THE NEWS**: Lists active hot financial topics.
2. **TRENDING**: Lists global macro news and market tags.
*Note: Both tickers are populated with 22+ custom entries to ensure the text stretches across ultra-wide desktop screens without leaving blank gaps, while maintaining smooth, swipeable touch-overflow scrolling on mobile.*

### Media Players (Video Constraints & Controls)
The page features multiple local MP4 video segments.
- **Layout Sizing**: Constrained to a standard `aspect-video` (16:9) container across all viewport widths. On mobile, this prevents portrait videos from occupying the entire screen height, keeping adjacent textual content visible above the fold.
- **Controls**: Removed `autoPlay` and `muted` settings, meaning the videos load paused by default.
- **Play/Pause Toggle**: Implemented a stateful `onClick` handler on the `<video>` elements, letting users play and pause media instantly by tapping directly on the video player area.

---

## 3. Meridian Prime Enquiry Page (`src/pages/Enquiry.tsx` & `/enquiry` Route)

The Enquiry page is a dark-theme, futuristic lead acquisition portal for **Meridian Prime**.

### WebGL Background Optimization (`Lightfall.tsx`)
The page features a dynamic, GPU-accelerated WebGL falling particle animation background (`Lightfall`).
- **Desktop Settings**: Renders at `density={0.3}` with `streakCount={2}` for vibrant, deep graphics.
- **Mobile Adaptations**: To prevent GPU rendering lags and battery drainage on mobile viewports (< 768px), a responsive React hook detects window width and scales the settings down to `density={0.12}` and `streakCount={1}` dynamically.

---

## 4. Contact Form & Instant Phone Validation

The contact form is situated at the bottom of the Enquiry page.

### The Country Dropdown Component (`CountrySelect.tsx`)
A custom select dropdown rendered inside the phone number input block. It is populated by the static configuration array in `src/lib/phoneValidation.ts`.
Each country object contains:
- `code`: Two-letter ISO country code (e.g. `CY`, `US`, `GB`, `IN`, `CH`).
- `flag`: Emoji representing the national flag.
- `dialCode`: International telephone prefix (e.g. `+357`, `+1`, `+44`, `+91`, `+41`).
- `placeholder`: Sample national phone format.
- `regex`: Standard regex format checking the national digit length and prefix.
- `errorMsg`: Detailed country-specific warning string specifying the exact expected digit length.

### Instant Validation Behavior
Instead of waiting for the user to blur out of the field, validation occurs **instantly as they type**.
- A `useEffect` hook in `Enquiry.tsx` and `routes/enquiry.tsx` monitors the `phone` state and the selected `country`.
- When changes occur, it validates the phone format against the respective country regex.
- If invalid, it immediately updates the `errors.phone` state, which displays the national digit requirement right below the input (e.g., *"US number must be 10 digits."*).
- If the phone input is cleared, the error is immediately removed since the phone number is optional.

---

## 5. API Endpoints & CRM Integration

The application routes lead submissions to a centralized CRM core.

### Endpoint Controllers
- **POST `/api/submit-lead`**: Accepts lead metadata, processes validation, posts to the external CRM, and increments database counts.
- **GET `/api/leads-count`**: Returns the cumulative number of successful lead submissions.

### CRM Payload Mapping
```json
{
  "country_name": "in",
  "description": "test message",
  "phone": "+917836278821",
  "email": "johndoe1982@gmail.com",
  "first_name": "test",
  "last_name": "Lead",
  "custom_fields": {
    "Source_ID": "website",
    "How_Much_Invested": "0",
    "Outline_Your_Case": "test message"
  }
}
```
*CRM Authorization Headers*:
- `Authorization: Bearer <CRM_TOKEN>`
- `x-token: <CRM_TOKEN>`

### Vercel Blob Storage Integration (`src/lib/leadStorage.ts`)
Cumulative lead submission count is persisted persistently across serverless restarts via **Vercel Blob Storage**:
- When a lead is accepted by the CRM, `incrementLeadCount()` is triggered.
- It writes a simple JSON counter payload to the Vercel Blob cloud.
- `/api/leads-count` reads this blob file to serve real-time statistics.

---

## 6. Resolved Challenges, Mistakes & Fixes

During the system integration, several critical bugs were identified and fixed:

### Bug 1: Hardcoded Country Parameter causing CRM Rejections
- **Symptom**: Form submissions containing Switzerland (`+41`) or India (`+91`) phone numbers were getting rejected by the CRM with a generic `{"error":"Lead is not valid!"}` message.
- **Cause**: The server-side payloads had `country_name: "cy"` (Cyprus) hardcoded. The CRM's internal validator failed the lead due to a mismatch between the country code (`cy`) and the telephone prefix (e.g., `+91`).
- **Fix**: Modified the API server (`api-dev-server.ts`), serverless handler (`api/submit-lead.ts`), and route handler to map `country_name` dynamically to the lowercase value of the selected country code from the dropdown: `(countryCode || "cy").toLowerCase()`.

### Bug 2: Local Development API Server Caching
- **Symptom**: Even after updating the country code logic, local submissions still printed `country_name: "cy"` in the terminal logs.
- **Cause**: The API dev server was launched statically via `tsx api-dev-server.ts` under concurrently. Changes made to the server file were not picked up without a manual process restart.
- **Fix**: Configured `package.json` scripts to run with `--watch` (`tsx --watch api-dev-server.ts`). Now, changes in the API server trigger automatic reloads instantly.

### Bug 3: Verbose and Overwhelming Error Output
- **Symptom**: When the CRM rejected invalid mock data, the application printed a long, multi-sentence error warning on the UI.
- **Cause**: The error response mapped the generic CRM warning to a detailed paragraph which cluttered the interface layout.
- **Fix**: Shortened the validation warning to a clear, single-sentence alert: *"Invalid phone number or email format. Please check the digits and selected country."*

### Bug 4: WebGL Render Lag on Mobile Viewports
- **Symptom**: On mobile devices, the Enquiry page suffered from frame drops and lag due to the WebGL Lightfall particle background.
- **Cause**: The background animation was loading the default desktop particle counts, which overwhelmed mobile GPUs.
- **Fix**: Added a viewport-width event listener hook that dynamically scales down the particle density (`0.12`) and streak count (`1`) on screens `< 768px`.
