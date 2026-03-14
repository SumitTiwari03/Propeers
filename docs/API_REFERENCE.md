# API Reference

Base URL (local): `http://localhost:8080`

## Health

### GET /api/health
Returns uptime health information.

Response:
```json
{
  "status": "ok",
  "uptime": 1234.56,
  "timestamp": "2026-03-15T12:34:56.000Z"
}
```

## Authentication

### POST /api/auth/login
Creates session cookie (`usertoken`) and returns user details.

### POST /api/auth/logout
Clears session.

### GET /api/profile
Returns current logged-in user from cookie token.

## Projects

### GET /api/projects
Returns project list enriched with creator and favorite state.

Important response fields:
- `_id`
- `title`
- `imgUrl`
- `projectUrl`
- `description`
- `techStack`
- `createdById`
- `createdByUsername`
- `isFavorite`

### GET /api/profile/project?userId=<id>
Returns projects for a user profile.

Compatibility:
- Supports both `createdBy` and legacy `user` owner fields.

### PATCH /api/profile/editproject
Updates project details.

Payload options:
- JSON body for text-only updates
- multipart/form-data with `imgUrl` file for image update

### POST /api/profile/upload
Uploads a new project with optional image.

## Favorites

### POST /api/projects/:projectId/favorite
Toggles a project in logged-in user favorites.

Success response:
```json
{
  "message": "Added to favorites",
  "isFavorite": true,
  "favorites": ["<projectId>"]
}
```

### GET /api/projects/favorites
Returns logged-in user's favorite projects.

Response includes:
- project fields
- `createdById`
- `createdByUsername`
- `isFavorite: true`

## Profiles

### GET /api/profile/details?userId=<id>
Returns profile data for the given user.

### PATCH /api/profile/edit
Updates logged-in user profile (supports image upload).

### POST /api/profile/post
Creates profile document.

Social link keys used by backend:
- `github`
- `linkedin`
- `twitter`
- `other`
