# Troubleshooting

## Projects not visible on Profile page

Checks:
1. Confirm user is authenticated (`/api/profile` returns user object).
2. Verify profile project API response:
   - `GET /api/profile/project?userId=<id>`
3. Ensure records contain either `createdBy` or legacy `user` owner field.
4. Confirm frontend request uses `params`, not `query`.

## Explore page shows No Projects while API has data

Checks:
1. Open browser console for runtime errors.
2. Verify `VITE_URL` points to running backend.
3. Confirm response array shape from `/api/projects`.
4. Ensure each project has safe defaults via frontend normalization.

## Favorite button not working

Checks:
1. Must be logged in (cookie required).
2. Endpoint:
   - `POST /api/projects/:projectId/favorite`
3. If 401 received, session expired; login again.
4. Ensure project id exists in DB.

## Favorite page empty unexpectedly

Checks:
1. Verify `GET /api/projects/favorites` response in network tab.
2. Confirm user document contains `favorites` array.
3. Confirm populated project ids still exist.

## Session expired right after login

Checks:
1. Validate cookie name is `usertoken`.
2. Validate `JWT_SECRETE` is set in backend env.
3. Ensure frontend requests include `withCredentials: true`.

## Social links not showing

Checks:
1. Ensure backend stores keys as:
   - `linkedin`, `twitter`, `other`
2. Ensure frontend reads same keys.
