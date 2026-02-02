# Contributing to Seizure Alert App

Welcome! This document outlines the best practices for contributing to this project. Following these steps ensures a clean history and safe deployments.

## 🌳 The "Feature Branch" Workflow

We use a feature branch workflow. This means you **never** work directly on the `main` branch. The `main` branch is for production-ready code only.

### 🚲 Cycle of Life for a Branch

1. **Create**: You make a new branch for a specific task.
2. **Work**: You write code and commit changes to that branch.
3. **Merge**: You submit a Pull Request (PR) to merge your branch into `main`.
4. **Delete**: Once merged, you delete the feature branch.

---

## step-by-Step Guide

### 1. Start Fresh

Before starting new work, always switch to `main` and get the latest updates.

```bash
git checkout main
git pull origin main
```

### 2. Create a Branch (Create as you go!)

Create a branch specifically for what you are about to do. Name it descriptively.

* **New Feature:** `feature/add-login-button`
* **Bug Fix:** `fix/white-screen-on-iphone`
* **Documentation:** `docs/update-readme`

```bash
# Example
git checkout -b feature/my-new-feature
```

### 3. Do Your Work

Make your code changes. When you are ready to save them:

```bash
git add .
git commit -m "Add new login button component"
```

### 4. Push to GitHub

Upload your branch to GitHub.

```bash
git push -u origin feature/my-new-feature
```

### 5. Create a Pull Request (PR)

1. Go to the repository on GitHub.
2. You will often see a yellow banner saying "Compare & pull request". Click it.
3. Review your changes and click **Create Pull Request**.
4. If everything looks good, click **Merge pull request**, then **Confirm merge**.

### 6. Cleanup (The important part!)

Now that your code is safely in `main`, you don't need the feature branch anymore.

**On GitHub:** Click the "Delete branch" button after merging.

**On your computer:**

```bash
# Switch back to the main branch
git checkout main

# Download the update (which now includes your merged work!)
git pull origin main

# Delete the old feature branch from your computer
git branch -d feature/my-new-feature
```

---

## 📝 Commit Messages

Write clear messages that explain *what* checking changed.

* ✅ `Fix typo in header`
* ✅ `Add new contact form`
* ❌ `fix`
* ❌ `update`
