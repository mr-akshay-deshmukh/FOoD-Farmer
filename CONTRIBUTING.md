# 🤝 Contributing to FOOD FARMER

First off, thank you for considering contributing to **FOOD FARMER**! It's people like you who make this platform an impactful tool for limiting food wastage and helping communities in need.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the maintainers.

---

## 🛠️ Development Workflow

### 1. Setting up your fork
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/food-farmer.git
   cd food-farmer
   ```
3. Set upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/food-farmer.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

### 2. Creating a Branch
Always branch from `main`:
```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/issue-description
```

Branch naming conventions:
- `feat/` for new user-facing features or capabilities
- `fix/` for bug fixes
- `refactor/` for code refactoring with no functional change
- `docs/` for documentation updates
- `perf/` for performance enhancements
- `test/` for testing additions

---

## 💬 Commit Message Guidelines

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Examples:
- `feat(integrations): add webhook signature validation for ERP inbound feeds`
- `fix(scanner): correct QR frame aspect ratio on high-DPI camera streams`
- `docs(readme): add system architecture flowchart and API reference`
- `perf(routes): memoize carbon calculation in dispatch optimizer`

---

## 🧪 Testing & Code Quality

Before opening a pull request, ensure the build passes cleanly:

1. **Type Checking & Linting**:
   ```bash
   npm run lint
   ```
2. **Build Verification**:
   ```bash
   npm run build
   ```
3. Verify that interactive UI components function smoothly without console exceptions.

---

## 🚀 Submitting a Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of the upstream repository.
3. Fill out the provided [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
4. Link any related issues (e.g., `Closes #42`).
5. A maintainer will review your code and provide feedback.

---

## 🎨 UI & Styling Constitution
- Follow Tailwind CSS v4 utility classes.
- Maintain the emerald green aesthetic for interactive buttons and key CTAs.
- Keep the dark theme (`bg-[#09130c]`) clean, contrast-rich, and accessible.
- Ensure all screens are responsive down to mobile viewports (360px).

Thank you for helping eliminate food waste! 🌱
