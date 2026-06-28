# Pulse — E2E Tests

| Directory | Contents |
|-----------|----------|
| [`cases/`](./cases/) | 11 Playwright spec files (47 tests total) |
| [`summary/`](./summary/) | Test summary table with credentials |

## Run

```bash
npx playwright test tests/cases/    # all 47 tests
npx playwright test tests/cases/03-doctors.spec.ts  # single file
npx playwright test --ui           # interactive mode
```

All accounts: `admin123` except patient (`admin231`).
