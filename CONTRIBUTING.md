# Contributing to TickDid

First off, thank you for considering contributing to TickDid! It's people like you that make TickDid such a great tool.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before proceeding.

## Security

For security issues, please see our [Security Policy](SECURITY.md) and follow the vulnerability reporting process outlined there.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A detailed description of the proposed functionality
* Any possible drawbacks
* Impact on existing features
* If possible, mock-ups or examples

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

1. Clone the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test your changes
5. Push to your fork and submit a pull request

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Style Guide

* Use TypeScript for new code
* Follow the existing code style
* Use meaningful variable names
* Comment complex logic
* Keep functions small and focused
* Use modern ES6+ features

### Testing

* Write tests for new features
* Ensure existing tests pass
* Follow the existing testing patterns
* Include both unit and integration tests where appropriate

### Documentation

* Update the README.md if needed
* Document new features
* Keep API documentation up to date
* Include comments in your code
* Update TypeScript types

## Project Structure

Please maintain the existing project structure:

```
tickdid/
├── src/
│   ├── app/                 # Next.js pages & routing
│   ├── components/          # React components
│   ├── lib/                 # Core business logic
│   ├── styles/             # Global styles & themes
│   └── types/              # TypeScript definitions
└── tests/                  # Test suites
```

## Questions?

Feel free to contact us if you have any questions. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under its MIT License. 