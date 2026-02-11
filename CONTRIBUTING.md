# Contributing to Aura Speaks AI

## 🌟 The "Enterprise" Standard

We adhere to strict engineering standards to ensure **Aura Speaks AI** is scalable, secure, and reliable. All contributors must follow these guidelines.

## 🌿 Branching Strategy (GitFlow-Lite)

We use a simplified strict branching model.

| Branch      | Protection | Description                                          |
| ----------- | ---------- | ---------------------------------------------------- |
| `main`      | **Locked** | Production-ready code. No direct commits. PRs only.  |
| `feature/*` | Open       | For new features (e.g., `feature/voice-activation`). |
| `fix/*`     | Open       | For bug fixes (e.g., `fix/login-crash`).             |
| `chore/*`   | Open       | For maintenance (e.g., `chore/dependency-updates`).  |

### Rules

1. Never commit directly to `main`.
2. Always create a new branch from `main`.
3. Branch names **MUST** be descriptive: `type/short-description`.

## 💾 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/).

- `feat: add new voice command`
- `fix: resolve crash on startup`
- `docs: update readme architecture`
- `style: format code with prettier`
- `refactor: simplify auth logic`
- `test: add unit tests for user hook`
- `chore: update dependencies`

## Pull Request Process

1. **Self-Review**: Run `npm run lint` and `npm run test` locally.
2. **Template**: Fill out the PR template completely.
3. **CI Checks**: All GitHub Actions (Lint, Type Check, Test) must pass.
4. **Review**: At least one approval is required to merge.

## 🛠️ Local Development Setup

1. **Install**: `npm install --legacy-peer-deps`
2. **Prepare**: `npm run prepare` (Sets up Husky hooks)
3. **Dev Server**: `npm run dev`
4. **Test**: `npm run test:run`

## 🔒 Security

- Do not commit secrets/keys.
- Ensure no sensitive data is logged.
