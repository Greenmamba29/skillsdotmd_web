---
name: test-generator
description: Automatically generate unit, integration, and end-to-end tests for existing code. Analyzes functions, classes, and API routes to produce test suites in Jest, Pytest, Vitest, or Playwright with edge cases and mocks.
license: MIT
tags: [testing, automation, code-quality, jest, pytest]
---

# Test Generator

## Overview

Analyze existing source code and automatically generate comprehensive test suites with unit tests, edge cases, mocks, and integration scenarios for the specified testing framework.

---

## When to Use

- Adding tests to a legacy codebase with zero coverage
- Generating test scaffolding after writing new features
- Bootstrapping a test suite before a major refactor
- Creating regression tests from bug reports
- Ensuring API endpoint coverage before deployment

---

## Instructions

1. Accept inputs: source file path(s) or directory, test framework (jest/pytest/vitest/playwright), coverage target (%), test type (unit/integration/e2e/all).
2. Parse the source code to identify: functions, classes, methods, API routes, exported interfaces.
3. For each function/method: analyze inputs, outputs, side effects, and error conditions.
4. Generate test cases covering: happy path, edge cases (null, empty, boundary values), error/exception paths.
5. Generate mocks for external dependencies (databases, APIs, file system).
6. For API routes: generate request/response tests with valid and invalid payloads.
7. Write test files following the project's naming convention (e.g., `*.test.ts`, `test_*.py`).
8. Return coverage estimate, test file paths, and list of untestable code sections.

---

## Environment

```
TEST_FRAMEWORK=jest
SOURCE_DIR=./src
OUTPUT_DIR=./tests
COVERAGE_TARGET=80
INCLUDE_MOCKS=true
```

---

## Examples

**Input:**
```
file: ./src/api/orders.ts
framework: jest
type: unit+integration
coverage_target: 85
```

**Output:**
```
Test suite generated: ./tests/api/orders.test.ts
Test cases: 24 (18 unit, 6 integration)
Edge cases covered: null inputs, empty arrays, 404/500 responses
Mocks generated: supabase client, stripe API
Estimated coverage: 87%
```
