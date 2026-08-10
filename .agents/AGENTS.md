# Workspace Rules & Development Standards

## 1. Test-Driven Development (TDD) — Strict Practice
- **Mandatory TDD Workflow**: All feature implementation and bug fixes MUST strictly follow the **Red-Green-Refactor** cycle:
  1. **Red**: Write a failing test first.
  2. **Green**: Write minimal code to pass the test.
  3. **Refactor**: Clean up code while keeping tests green.
- Never write production logic without a failing test first.

## 2. Integration & E2E Testing Database Standard
- **Production Engine Parity**: All integration/E2E database tests MUST use a **PostgreSQL** database (matching production engine) via a dedicated test container/database.

## 3. Unit Testing Standard
- **Pure Isolation**: Unit tests (`*.spec.ts`) must mock all external providers and repositories (`useValue` / `jest.fn()`). No live database connections during unit tests.

## 4. Code Testability & 100% Coverage Commit Enforcement
- **Design for Testability**: All production code MUST be written such that it is easily testable (loosely coupled, clean interfaces, dependency injection).
- **Strict 100% Test & Edge-Case Coverage**: All commits MUST be thoroughly checked to guarantee 100% test coverage including all happy paths, error branches, and edge cases.
- **Commit Rejection & Reversal**: Any code that fails to achieve 100% test and edge-case coverage MUST NOT be committed. If unverified or under-covered code is committed, it MUST be immediately reverted.


