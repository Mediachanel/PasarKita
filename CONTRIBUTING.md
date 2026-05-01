# Contributing Guide - Pasar Kita

## 🤝 How to Contribute

### Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit with clear messages: `git commit -m "feat: Add new feature"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create Pull Request

### Commit Message Format

Use conventional commits:
```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Code Style

- Use TypeScript for all files
- Follow ESLint rules: `npm run lint:fix`
- Format code with Prettier (if configured)
- Write descriptive variable/function names
- Add JSDoc comments for complex functions

### Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add yourself to contributors list
4. Describe changes clearly
5. Reference related issues

### Feature Development

#### Adding a New Page
1. Create folder in `src/app/your-feature`
2. Create `page.tsx` file
3. Add route in navigation
4. Update documentation

#### Adding a New Component
1. Create in `src/components/YourComponent.tsx`
2. Export from `src/components/index.ts`
3. Use in pages as needed
4. Document props in JSDoc

#### Adding a New API Route
1. Create in `src/app/api/your-route`
2. Export handler function
3. Add documentation in API.md
4. Test with Postman/curl

### Database Changes

1. Update `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name your_migration_name`
3. Update DATABASE.md
4. Test migrations work

### Testing

```bash
# Run development server
npm run dev

# Test in browser
# - Test all pages load
# - Test navigation
# - Test forms
# - Test responsiveness

# Manual testing checklist
- [ ] Feature works on desktop
- [ ] Feature works on mobile
- [ ] No console errors
- [ ] No linting errors
```

### Documentation

- Update README.md for major changes
- Update API.md for new endpoints
- Add comments to complex code
- Update USER_GUIDE.md if affecting users

### Reporting Issues

Include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (OS, browser, Node version)

### Questions?

- Check existing documentation
- Review similar code sections
- Ask in discussions/issues

---

**Thank you for contributing to Pasar Kita!** 🎉
