| name | description | license | tags |
|------|-------------|---------|------|
| webapp-testing | Generate and execute comprehensive test suites for web applications. Covers unit, integration, E2E, and visual regression tests. Analyzes application structure to create meaningful test cases with high coverage. | MIT | --- testing qa automation e2e playwright jest |

# Webapp Testing

## Overview

Generate and execute comprehensive test suites for web applications covering unit, integration, end-to-end, and visual regression testing. Analyzes application structure to produce high-coverage, meaningful test cases.

## When to Use

- When building a new feature that needs test coverage from day one
- When a codebase has low test coverage and you want to improve it
- When setting up an E2E test suite for critical user flows
- When adding visual regression tests to catch UI regressions
- When preparing a release and need to verify all critical paths

## Instructions

1. Accept: application source directory or URL, test type(s) to generate (unit/integration/e2e/visual), coverage targets, and testing framework preference.
2. Analyze application structure:
   - Identify components, pages, and API endpoints.
   - Map critical user flows (auth, checkout, core CRUD operations).
   - Review existing tests to avoid duplication.
3. Generate unit tests:
   - Pure functions: input/output coverage including edge cases.
   - React/Vue components: render, props, state changes, event handlers.
   - Use Jest/Vitest with React Testing Library for component tests.
4. Generate integration tests:
   - API endpoint tests: happy path, validation errors, auth failures.
   - Database interactions: CRUD operations with test fixtures.
   - Service layer: mock external dependencies.
5. Generate E2E tests (Playwright):
   - Critical user flows: registration, login, primary feature, checkout.
   - Cross-browser: Chromium, Firefox, WebKit.
   - Mobile viewport coverage.
   - Test data fixtures and cleanup.
6. Generate visual regression tests:
   - Screenshot tests for key pages and components.
   - Baseline capture and comparison configuration.
7. Calculate coverage estimate and identify untested paths.
8. Return test files, coverage estimate, and setup instructions.

## Environment

```
FRAMEWORK=playwright+jest
COVERAGE_TARGET=80
BROWSERS=chromium,firefox,webkit
INCLUDE_VISUAL=true
TEST_DATA_FIXTURES=true
```

## Examples

**Input:**
```
app_url: https://staging.myapp.com
app_dir: ./src
test_types: [e2e, unit]
coverage_target: 85
priority_flows: [login, checkout, user-profile]
```

**Output:**
```
Webapp Test Suite Generated
Test files created: 12
Estimated coverage: 87%

Unit tests (6 files):
- auth.service.test.ts: 24 tests (login, register, token refresh)
- cart.utils.test.ts: 18 tests (add, remove, calculate totals)
- CheckoutForm.test.tsx: 15 tests (validation, submission, error states)

E2E tests (4 files, Playwright):
- auth.spec.ts: login/logout flow (3 scenarios)
- checkout.spec.ts: full purchase flow (5 scenarios)
- profile.spec.ts: profile CRUD (4 scenarios)

Setup: npx playwright install && npm test
CI config: .github/workflows/test.yml generated
```
