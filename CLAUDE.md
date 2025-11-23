# CLAUDE.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants (like Claude) working with this codebase. It outlines the project structure, development workflows, conventions, and best practices to follow.

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflow](#development-workflow)
4. [Key Conventions](#key-conventions)
5. [AI Assistant Guidelines](#ai-assistant-guidelines)
6. [Common Patterns](#common-patterns)
7. [Testing Strategy](#testing-strategy)
8. [Dependencies and Tools](#dependencies-and-tools)
9. [Troubleshooting](#troubleshooting)

---

## Repository Overview

### Purpose
[Describe the main purpose and goals of this repository]

### Tech Stack
- **Language(s)**: [e.g., TypeScript, Python, Go]
- **Framework(s)**: [e.g., React, Express, FastAPI]
- **Build Tool**: [e.g., Webpack, Vite, npm, Poetry]
- **Testing**: [e.g., Jest, pytest, Go test]
- **CI/CD**: [e.g., GitHub Actions, CircleCI]

### Key Dependencies
[List critical dependencies and their purposes]

---

## Codebase Structure

### Directory Layout

```
.
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── services/           # Business logic and API services
│   ├── utils/              # Utility functions and helpers
│   ├── types/              # Type definitions
│   └── config/             # Configuration files
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
├── docs/                   # Documentation
├── scripts/                # Build and utility scripts
└── public/                 # Static assets
```

### Module Organization

**Component Structure**:
- Each component should have its own directory with related files
- Co-locate tests, styles, and types with components

**Service Layer**:
- Services handle business logic and external API calls
- Keep services focused on single responsibilities
- Use dependency injection for testability

**Utilities**:
- Pure functions without side effects
- Well-documented with JSDoc/docstrings
- Comprehensive unit test coverage

---

## Development Workflow

### Getting Started

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   npm install  # or pip install -r requirements.txt, etc.
   ```

2. **Environment Configuration**:
   - Copy `.env.example` to `.env`
   - Fill in required environment variables
   - Never commit `.env` files

3. **Run Development Server**:
   ```bash
   npm run dev  # or appropriate command
   ```

### Branch Strategy

- **main/master**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: New features (`feature/user-authentication`)
- **bugfix/***: Bug fixes (`bugfix/login-error`)
- **hotfix/***: Urgent production fixes (`hotfix/security-patch`)
- **claude/***: AI-assisted development branches

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add OAuth2 authentication
fix(api): resolve race condition in data fetching
docs(readme): update installation instructions
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes with clear, atomic commits
3. Write/update tests for new functionality
4. Update documentation as needed
5. Run full test suite locally
6. Create PR with descriptive title and body
7. Address review feedback
8. Squash and merge when approved

---

## Key Conventions

### Code Style

**General Principles**:
- Write self-documenting code with clear variable/function names
- Keep functions small and focused (single responsibility)
- Prefer composition over inheritance
- Use meaningful comments for complex logic only
- Follow DRY (Don't Repeat Yourself) principle
- Use consistent naming conventions

**Naming Conventions**:
- `camelCase` for variables and functions
- `PascalCase` for classes and components
- `UPPER_SNAKE_CASE` for constants
- `kebab-case` for file names (or follow project convention)
- Prefix private methods with `_` (if applicable)

**File Organization**:
- One component/class per file
- Group related functionality in directories
- Index files for clean imports
- Keep files under 300-400 lines when possible

### Error Handling

**Best Practices**:
- Use specific error types/classes
- Always handle errors at appropriate levels
- Log errors with context for debugging
- Provide user-friendly error messages
- Don't swallow errors silently

**Example Pattern**:
```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new CustomError('User-friendly message', error);
}
```

### API Design

**RESTful Conventions**:
- Use HTTP methods appropriately (GET, POST, PUT, DELETE, PATCH)
- Use plural nouns for resources (`/users`, `/posts`)
- Use proper status codes (200, 201, 400, 404, 500, etc.)
- Version APIs (`/api/v1/users`)
- Use consistent response formats

**Request/Response Format**:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "metadata": {
    "timestamp": "2025-11-23T00:00:00Z",
    "requestId": "uuid"
  }
}
```

### Security Practices

**Critical Rules**:
- Never commit secrets, API keys, or credentials
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use HTTPS for all API communications
- Keep dependencies updated for security patches
- Follow OWASP Top 10 guidelines

---

## AI Assistant Guidelines

### Code Analysis Approach

When analyzing this codebase:

1. **Start with Documentation**: Read README, package.json, and configuration files
2. **Understand Structure**: Map out the directory structure and module relationships
3. **Identify Patterns**: Look for recurring patterns and architectural decisions
4. **Check Dependencies**: Understand external dependencies and their usage
5. **Review Tests**: Tests often reveal intended behavior and edge cases

### Making Changes

**Before Modifying Code**:
- ✅ Always read the file(s) you plan to modify
- ✅ Understand the context and existing patterns
- ✅ Check for related tests that may need updates
- ✅ Consider backwards compatibility
- ✅ Look for similar implementations elsewhere

**While Making Changes**:
- ✅ Follow existing code style and patterns
- ✅ Keep changes minimal and focused
- ✅ Update or add tests for new functionality
- ✅ Update relevant documentation
- ✅ Avoid over-engineering or unnecessary abstractions
- ❌ Don't refactor unrelated code
- ❌ Don't add features beyond what's requested
- ❌ Don't modify files you haven't read

**After Making Changes**:
- ✅ Run tests to ensure nothing broke
- ✅ Check for TypeScript/linting errors
- ✅ Review the diff before committing
- ✅ Write clear commit messages
- ✅ Update CHANGELOG if applicable

### Communication Style

**When Explaining Code**:
- Reference specific files and line numbers (`src/utils/helper.ts:42`)
- Provide context about why, not just what
- Use code examples to illustrate points
- Highlight potential gotchas or edge cases

**When Proposing Changes**:
- Explain the reasoning behind the approach
- Discuss trade-offs if multiple solutions exist
- Mention any assumptions being made
- Flag potential breaking changes

### Common Tasks

**Adding a New Feature**:
1. Understand the requirements thoroughly
2. Check if similar features exist
3. Plan the implementation (components, services, utilities)
4. Implement in small, testable increments
5. Add comprehensive tests
6. Update documentation
7. Create PR with clear description

**Debugging Issues**:
1. Reproduce the issue if possible
2. Check logs and error messages
3. Use grep/search to find related code
4. Review recent changes that might have caused it
5. Add tests to prevent regression
6. Fix the issue with minimal changes
7. Verify the fix works

**Refactoring Code**:
1. Ensure comprehensive test coverage exists
2. Make incremental changes
3. Run tests after each change
4. Keep commits atomic and focused
5. Don't mix refactoring with feature additions
6. Document significant architectural changes

---

## Common Patterns

### Design Patterns in Use

**[List common design patterns used in the codebase]**

Examples:
- **Singleton**: For configuration management
- **Factory**: For creating complex objects
- **Observer**: For event handling
- **Repository**: For data access abstraction
- **Dependency Injection**: For loose coupling

### Code Templates

**Component Template** (if applicable):
```typescript
// Example component structure
import React from 'react';
import { ComponentProps } from './types';
import styles from './Component.module.css';

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic

  return (
    <div className={styles.container}>
      {/* Component JSX */}
    </div>
  );
};
```

**Service Template**:
```typescript
// Example service structure
export class ServiceName {
  constructor(private dependency: DependencyType) {}

  async performOperation(params: ParamsType): Promise<ResultType> {
    // Service logic
  }
}
```

---

## Testing Strategy

### Test Coverage Goals

- **Unit Tests**: Aim for 80%+ coverage
- **Integration Tests**: Cover critical user flows
- **E2E Tests**: Cover main application workflows

### Testing Best Practices

**Unit Tests**:
- Test one thing per test
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies
- Test edge cases and error conditions

**Integration Tests**:
- Test component interactions
- Use realistic test data
- Clean up after tests
- Test both success and failure scenarios

**E2E Tests**:
- Test from user perspective
- Cover critical business flows
- Keep tests independent
- Use stable selectors

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.spec.ts
```

---

## Dependencies and Tools

### Package Management

- Keep dependencies up to date
- Review dependency changes in PRs
- Use exact versions for critical dependencies
- Regularly audit for security vulnerabilities

```bash
npm audit
npm outdated
```

### Development Tools

**Linting**:
```bash
npm run lint
npm run lint:fix
```

**Type Checking** (if applicable):
```bash
npm run type-check
```

**Formatting**:
```bash
npm run format
```

### Pre-commit Hooks

If using Husky or similar:
- Linting runs automatically
- Tests run on commit
- Commit message format is validated

---

## Troubleshooting

### Common Issues

**Build Failures**:
1. Clear cache: `rm -rf node_modules && npm install`
2. Check Node version matches requirements
3. Verify all environment variables are set
4. Review build logs for specific errors

**Test Failures**:
1. Run tests individually to isolate issues
2. Check for test interdependencies
3. Verify test data and mocks are correct
4. Clear test cache if using Jest

**Runtime Errors**:
1. Check browser console for frontend issues
2. Review server logs for backend issues
3. Verify API endpoints and network requests
4. Check environment configuration

### Getting Help

- Check existing issues on GitHub
- Review documentation in `/docs`
- Ask in team communication channels
- Provide clear reproduction steps when reporting issues

---

## Additional Resources

### Documentation

- [Link to additional docs]
- [Architecture diagrams]
- [API documentation]
- [Deployment guides]

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

### License

[License information]

---

## Maintenance Notes

**Last Updated**: 2025-11-23
**Maintained By**: [Team/Individual]
**Review Frequency**: Update this document when significant changes occur to:
- Project structure
- Development workflows
- Key conventions
- Technology stack

---

## Quick Reference for AI Assistants

### ⚡ Quick Checklist

Before making any changes:
- [ ] Read the files you plan to modify
- [ ] Understand the existing patterns
- [ ] Check for related tests
- [ ] Consider backwards compatibility

When implementing features:
- [ ] Follow existing code style
- [ ] Add/update tests
- [ ] Update documentation
- [ ] Keep changes focused and minimal

Before committing:
- [ ] Run tests (`npm test`)
- [ ] Run linter (`npm run lint`)
- [ ] Review your changes
- [ ] Write clear commit message

### 🎯 Key Principles

1. **Read Before Write**: Always read existing code before modifying
2. **Test Everything**: New code needs tests
3. **Follow Patterns**: Consistency is key
4. **Keep It Simple**: Avoid over-engineering
5. **Document Changes**: Update docs and comments
6. **Commit Clearly**: Use conventional commit messages
7. **Ask When Unclear**: Seek clarification on ambiguous requirements

---

*This document is a living guide. As the project evolves, keep this documentation updated to reflect current practices and conventions.*
