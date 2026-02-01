---
title: Route Organization
impact: MEDIUM
tags: [routes, organization, file-structure]
---

# Route Organization

Use `react-router-auto-routes` for file-system routing, enabling flexible organization with folder-based or flat routes and colocated files.

## Why

- **Flexible Organization**: Mix and match folders and flat files.
- **Colocation**: Keep components and utilities next to routes using `+` prefix.
- **Scalable**: Supports monorepos and sub-apps.
- **Clean**: No need for complex manual route configuration.

## File Structure

`react-router-auto-routes` allows both folder-based and dot-delimited (flat) structures.

```
routes/
  # Index route
  index.tsx                 # /

  # Simple route
  about.tsx                 # /about

  # Folder-based route
  settings/
    index.tsx               # /settings
    profile.tsx             # /settings/profile

  # Dot-delimited (flat) route
  auth.login.tsx            # /auth/login
  auth.register.tsx         # /auth/register

  # Pathless layout (folder)
  _auth/
    _layout.tsx             # Layout for /login, /register
    login.tsx               # /login

  # Dynamic parameters
  users/
    $id.tsx                 # /users/:id

  # Resource route
  api/
    users.ts                # /api/users
```

## Colocation

Colocate non-route files (components, utils, tests) directly in your route directories using the `+` prefix. These files are ignored by the router.

**Convention**: Use `+<ParentName>` (e.g. `+dashboard`) instead of generic `+` folders. This makes imports easier to identify at a glance (e.g. `import ... from "./+dashboard/utils"`) and avoids confusion from having multiple `+` folders in your codebase.

```
routes/
  dashboard/
    _layout.tsx             # Dashboard layout
    index.tsx               # /dashboard
    analytics.tsx           # /dashboard/analytics

    # Shared code for dashboard routes
    +dashboard/
      sidebar.tsx
      queries.server.ts
      types.ts

  users/
    $id/
      index.tsx             # /users/:id

      # Route-specific colocation
      +user-id/             # Shared scope for this route
        queries.server.ts
        user-card.tsx
```

## Naming Conventions

| Pattern           | Meaning               | URL                 |
| ----------------- | --------------------- | ------------------- |
| `index.tsx`       | Index route           | `/` parent path     |
| `_layout.tsx`     | Layout component      | Wraps child routes  |
| `about.tsx`       | Named route           | `/about`            |
| `_auth/`          | Pathless layout group | (no URL segment)    |
| `$id.tsx`         | Dynamic segment       | `/:id`              |
| `($lang).tsx`     | Optional segment      | `/:lang?`           |
| `$.tsx`           | Splat (catch-all)     | `/*`                |
| `robots[.]txt.ts` | Escaped character     | `/robots.txt`       |
| `+queries.ts`     | Colocated file        | (ignored by router) |
| `+dashboard/`     | Colocated folder      | (ignored by router) |

## Example: Complex Feature

```
routes/
  projects/
    _layout.tsx               # Layout: /projects
    index.tsx                 # Page:   /projects

    # Nested dynamic route
    $projectId/
      _layout.tsx             # Layout: /projects/:projectId
      index.tsx               # Page:   /projects/:projectId
      settings.tsx            # Page:   /projects/:projectId/settings

      # Shared files for $projectId routes
      +project-id/
        queries.server.ts
        project-nav.tsx

      # Specific to settings page (could also be in settings.tsx)
      +settings/
        form-schema.ts
```

### Example Code

**`routes/projects/$projectId/index.tsx`**

```tsx
import type { Route } from "./+types/index";
// generated types if using them
import { useLoaderData } from "react-router";
import { ProjectNav } from "./+project-id/project-nav";
import { getProject } from "./+project-id/queries.server";

export async function loader({ params }: Route.LoaderArgs) {
  const project = await getProject(params.projectId);
  return { project };
}

export default function ProjectRoute({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;
  return (
    <div>
      <ProjectNav project={project} />
      <h1>{project.name}</h1>
    </div>
  );
}
```
