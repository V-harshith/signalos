# SignalOS

**Turn hard-won expertise into an evidence-backed founder brand across LinkedIn and X—without sounding automated.**

SignalOS is a focused content strategy workspace for B2B founders and consultants. It helps users notice what they uniquely know, attach proof, adapt one idea natively for LinkedIn and X, and make a coherent weekly plan. It is not a broad social scheduler or engagement bot.

## Refined positioning

Most writing products optimize for producing *more*. SignalOS optimizes for making a founder's real expertise recognizable. Its wedge is the step before publishing: turning customer conversations, operating lessons, experiments, and decisions into credible, voice-aware content.

- **Initial customer:** B2B founders and independent consultants building a founder-led brand while operating the business.
- **Core job:** “Help me consistently turn what I learn at work into useful content without becoming a full-time creator.”
- **Promise:** One evidence-backed idea becomes distinct, human-reviewed LinkedIn and X drafts plus a clear next action.
- **Differentiation:** Evidence before generation; platform-native adaptation; deliberate growth experiments; human approval; useful recommendations rather than vanity dashboards.
- **Working name:** SignalOS remains a strong fit: it frames expertise as signal and the product as the operating system that helps it travel.

## MVP journey

1. **Strategy onboarding:** Define audience, promise, voice, and 3–5 content pillars.
2. **Capture:** Record one raw idea plus firsthand evidence, customer signal, or a result.
3. **Transform:** Generate separate LinkedIn and X drafts using local, transparent templates.
4. **Review:** Inspect and mark drafts ready; no automatic publishing.
5. **Plan:** Place a small number of posts into a sustainable weekly queue.
6. **Learn:** Review clear recommendations, pillar gaps, and one growth experiment.

The demo is pre-populated so the complete journey is usable immediately. Strategy, pillars, captured ideas/evidence, generated drafts, and draft edits persist in the browser's local storage. Drafts can be reviewed from both Idea Studio and the Content Plan, with editable text, platform, approval status, and schedule label. Data remains local to the current browser and device.

## Architecture

- React + TypeScript
- Vite build and development server
- Lucide icons
- CSS design system with responsive breakpoints, visible focus states, semantic controls, reduced-motion support, and a mobile navigation drawer
- Local rule/template-based draft generation; no backend, tokens, or API credentials

Key files:

```text
src/App.tsx       Product flow, local state, and UI views
src/styles.css    Responsive visual system and components
src/main.tsx      Application entry
```

## Setup

Requires a current Node.js LTS release.

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run build
npm run preview
```

## Current limitations

- Workspace state is local-only browser storage; there is no cloud sync, account recovery, or multi-device access.
- Draft transformation is deterministic and template-based, not AI-generated.
- Calendar dates and insights are illustrative local demo data.
- There are no accounts, teams, backend storage, platform connections, or publishing.
- Recommendations infer only from local content metadata. The product intentionally displays no fake reach or engagement analytics.

## Compliance and safety stance

SignalOS is designed for official, platform-safe workflows. It does **not** scrape social networks, automate comments, send mass DMs, fabricate engagement, impersonate users, or publish without explicit human review. Future platform integrations should use official APIs and requested scopes, preserve an audit trail, respect rate limits and deletion requests, and clearly label generated suggestions. Business-outcome attribution should be opt-in and distinguish correlation from causation.

## Prioritized next engineering steps

1. Add local persistence, then authenticated workspaces and a durable data model for strategies, evidence, ideas, drafts, and plans.
2. Add an explainable LLM drafting service with structured outputs, source-to-claim traceability, voice controls, moderation, and cost/rate limits.
3. Build editing, draft version history, approval states, and accessible drag-or-keyboard calendar scheduling.
4. Add official LinkedIn/X connection and publishing flows only where permitted, with explicit confirmation and audit logs.
5. Replace demo insights with measured first-party results; label confidence and never infer unsupported business outcomes.
6. Add unit tests for transformations, component tests for the core journey, end-to-end accessibility checks, and CI build validation.
7. Validate activation and willingness-to-pay before adding agency/team breadth. Suggested hypothesis: free capture/preview, Creator at $15, Growth at $29, Team at $69, Agency at $149.
