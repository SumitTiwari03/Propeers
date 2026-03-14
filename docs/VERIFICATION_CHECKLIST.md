# Verification Checklist

Run this checklist after local changes or deployment.

## Auth

- [ ] Login works and redirects to Profile.
- [ ] `/api/profile` returns authenticated user.
- [ ] Logout clears session and blocks protected actions.

## Profile

- [ ] Own profile loads details and projects.
- [ ] Project cards show image (`imgUrl`) and visit link.
- [ ] Edit profile button is visible only on own profile.
- [ ] Visiting `/profile?userId=<otherUserId>` shows public developer profile.

## Project Edit

- [ ] Project title/description/url updates are saved.
- [ ] Project image edit updates image correctly.

## Explore

- [ ] `/projects` shows cards.
- [ ] Search by title/tech/creator works.
- [ ] Creator shows username, not user id.
- [ ] Visit Dev Profile opens selected developer profile.

## Favorites

- [ ] Heart toggle adds/removes project from favorites.
- [ ] `/favorites` route opens and loads list.
- [ ] Removing favorite updates list immediately.
- [ ] Favorites item shows creator username and project link.

## Monitoring

- [ ] `GET /api/health` returns 200.
- [ ] Uptime monitor points to `/api/health`.

## Data Compatibility

- [ ] Older projects (legacy `user` owner field) still appear on profile.
- [ ] New projects (using `createdBy`) appear correctly.
