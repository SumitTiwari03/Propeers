# Feature Flow Guide

## 1) Login to Profile Flow

1. User logs in with email/username and password.
2. Backend sets `usertoken` cookie.
3. Header and profile pages call `/api/profile` with credentials.
4. If token is valid, profile loads using returned `userId`.
5. Profile then fetches:
   - `/api/profile/details?userId=<id>`
   - `/api/profile/project?userId=<id>`

## 2) Explore Projects Flow

1. Projects page calls `/api/projects`.
2. Backend populates creator username and marks favorites for logged-in user.
3. Frontend normalizes records to avoid render crashes on partial data.
4. User can search by title, tech stack, or creator.

## 3) Visit Developer Profile Flow

1. User opens project modal.
2. Clicks Visit Dev Profile.
3. Frontend navigates to `/profile?userId=<createdById>`.
4. Profile page detects query param and loads that developer profile.
5. Owner-only actions are hidden if it is not the current user profile.

## 4) Favorites Flow

1. User clicks heart icon in project modal.
2. Frontend calls `POST /api/projects/:projectId/favorite`.
3. Backend toggles project id in user favorites array.
4. Explore state updates immediately (`isFavorite`).
5. Favorites page (`/favorites`) fetches list from `GET /api/projects/favorites`.
6. User can remove favorites directly on Favorites page.

## 5) Edit Project Image Flow

1. Owner opens project edit modal in Profile page.
2. Selects new image (preview shown).
3. Frontend sends multipart request to edit endpoint.
4. Backend uploads image to Cloudinary.
5. Backend saves `imgUrl` and returns updated project.
