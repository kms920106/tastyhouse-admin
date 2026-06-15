<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-16 | Updated: 2026-06-16 -->

# data

## Purpose
Static/mock data sources for the template. There is no backend or database — screens render from these in-repo datasets.

## Key Files
| File | Description |
|------|-------------|
| `users.ts` | Mock user records used by the Users management screen and other user-facing UI |

## For AI Agents

### Working In This Directory
- This data is illustrative. When wiring a real backend, replace these modules with fetches/Server Actions rather than mutating consumers.
- Most feature-specific mock data lives alongside its route in that route's `_components/` instead of here; this folder holds only broadly shared datasets.

### Common Patterns
- Plain typed TS modules exporting arrays/objects.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
