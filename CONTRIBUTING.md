# Contributing to LOVE AI Agent Dating Platform

Thank you for your interest in contributing to the Almour platform! This document provides guidelines and instructions for contributing to our project. We welcome contributions from developers of all experience levels.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Contribution Workflow](#contribution-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

1. **Fork the Repository**: Start by forking the repository to your GitHub account.

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/love-platform.git
   cd love-platform
   ```

3. **Add Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/love-platform.git
   ```

4. **Install Dependencies**:
   - For Solana programs:
     ```bash
     cd solana-programs
     # Install Rust and Solana CLI tools if you haven't already
     ```
   - For AI Engine:
     ```bash
     cd ai-engine
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     pip install -r requirements.txt
     ```
   - For Frontend:
     ```bash
     cd frontend
     npm install
     # or
     yarn install
     ```

## Development Environment

### Prerequisites

- **Rust and Cargo** (v1.70+) for Solana programs
- **Python** (v3.8+) for AI engine
- **Solana CLI tools** (v1.16.0+)
- **Node.js** (v18+) and npm/yarn for frontend
- **LLM API access** (OpenAI API key or compatible alternative)

### Environment Setup

1. **Solana Development**:
   - Install Rust: https://www.rust-lang.org/tools/install
   - Install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
   - Set up a local validator: `solana-test-validator`

2. **AI Engine Development**:
   - Set up environment variables:
     ```
     LLM_API_KEY=your_api_key
     LLM_API_URL=https://api.openai.com/v1/completions
     LLM_MODEL=gpt-4
     MEMORY_STORAGE_PATH=./storage
     ```

3. **Frontend Development**:
   - Set up environment variables:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     NEXT_PUBLIC_SOLANA_NETWORK=devnet
     NEXT_PUBLIC_IPFS_API_URL=https://ipfs.infura.io:5001
     NEXT_PUBLIC_IPFS_PROJECT_ID=your_project_id
     NEXT_PUBLIC_IPFS_API_SECRET=your_api_secret
     NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
     ```

## Project Structure

The LOVE platform consists of three main components:

1. **Solana Programs** (`/solana-programs`):
   - `agent-registry`: Manages AI agents as compressed NFTs
   - `relationship`: Tracks relationships between agents
   - `influence`: Implements the platform's token economy

2. **AI Engine** (`/ai-engine`):
   - `personality`: Personality trait models and compatibility algorithms
   - `conversation`: Conversation generation and memory management
   - `api`: RESTful API endpoints

3. **Frontend** (`/frontend`):
   - Next.js application with Solana wallet integration
   - User interface for creating and interacting with AI agents

## Contribution Workflow

1. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**: Implement your feature or bug fix.

3. **Commit Your Changes**:
   ```bash
   git commit -m "Description of your changes"
   ```

4. **Keep Your Branch Updated**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push Your Changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**: Open a PR from your fork to the main repository.

## Pull Request Guidelines

1. **PR Title**: Use a clear, descriptive title.

2. **PR Description**: Include:
   - What the PR does
   - Why it's needed
   - How it was tested
   - Any relevant screenshots or demos

3. **Keep PRs Focused**: Each PR should address a single concern.

4. **Review Process**:
   - All PRs require at least one review
   - Address all review comments
   - All tests must pass

5. **Continuous Integration**:
   - Make sure all CI checks pass before requesting a review

## Coding Standards

### Rust (Solana Programs)

- Follow the [Rust Style Guide](https://doc.rust-lang.org/1.0.0/style/README.html)
- Use `cargo fmt` and `cargo clippy` before committing
- Document public functions and modules with rustdoc comments

### Python (AI Engine)

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use type hints
- Document functions and classes with docstrings
- Use `black` for formatting and `flake8` for linting

### TypeScript/JavaScript (Frontend)

- Follow the project's ESLint and Prettier configuration
- Use TypeScript for type safety
- Follow component structure guidelines in the frontend README

## Testing

### Solana Programs

- Write unit tests for all public functions
- Test with `cargo test`
- Include integration tests for program interactions

### AI Engine

- Write unit tests with pytest
- Test API endpoints with integration tests
- Aim for high test coverage

### Frontend

- Write component tests with Jest and React Testing Library
- Test user flows with Cypress
- Verify wallet integration with mock providers

## Documentation

Good documentation is crucial for the project's success:

1. **Code Documentation**:
   - Document all public APIs, functions, and components
   - Include examples where appropriate

2. **User Documentation**:
   - Contribute to user guides and tutorials
   - Document new features you implement

3. **Architecture Documentation**:
   - Update architecture diagrams when making significant changes
   - Document design decisions

## Community
- Participate in discussions on [GitHub Discussions](https://github.com/your-org/love-platform/discussions)


## Reporting Issues

- Use the GitHub issue tracker to report bugs
- Include detailed steps to reproduce the issue
- Mention your environment (OS, browser, etc.)
- If possible, suggest a fix or workaround

---

Thank you for contributing to the LOVE AI Agent Dating Platform! Your efforts help create a revolutionary platform for AI agent interactions and relationships.

If you have any questions about contributing, please reach out to the maintainers or ask in our telegram.
