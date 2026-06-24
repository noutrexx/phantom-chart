# Contributing

Thanks for taking the time to improve Phantom Eats.

## Local setup

`ash
npm install
npm run dev -- --port 5180 --strictPort
`

## Quality checks

Run these before opening a pull request:

`ash
npm run build
npm run test:e2e
git diff --check
`

## Pull request expectations

- Keep UI changes consistent with the mobile-first delivery-app style.
- Keep payment behavior simulated; do not add real payment processing or card storage.
- Update screenshots and README content when visible UI changes.
- Add or update Playwright coverage for changed user flows.
