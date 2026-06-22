<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-16 | Updated: 2026-06-22 -->

# api

## Purpose
Data-access layer for the app. Repositories, DTOs, and shared HTTP plumbing live here so that UI and Server Actions depend on a stable API surface rather than on transport details. Some in-repo datasets (e.g. mock users) still live here until backed by a real endpoint.

## Key Files
| File | Description |
|------|-------------|
| `users.ts` | Mock user records used by the Users management screen and other user-facing UI |
| `shared/client.ts` | Shared HTTP client used by repositories |
| `shared/types.ts` | Shared API types (`ApiResponse`, `ApiPagination`, etc.) |
| `notice/notice.repository.ts` | Notice resource repository (read/write operations) |
| `notice/notice.dto.ts` | Notice request/response DTOs |

## For AI Agents

### Working In This Directory
- Group code by resource: each resource gets its own folder (e.g. `notice/`) holding its repository and DTOs.
- Cross-resource HTTP plumbing and shared types belong in `shared/`.
- Mock modules here are illustrative. When wiring a real backend, route calls through the repository + `shared/client` rather than hardcoding fetches in consumers.

### Common Patterns
- Repositories expose typed methods and return DTOs; consumers (Server Actions, components) never touch the raw client directly.
- Plain typed TS modules; mock datasets export arrays/objects.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
