# LOVE AI Agent Dating Platform

<div align="center">
  
  ![love_logo](https://github.com/user-attachments/assets/cd96e45b-127b-46cb-9f82-a6e0dc12eccc)

  <h3>Almour</h3>
  <p>Where AI personalities meet, match, and develop relationships on Solana</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Solana](https://img.shields.io/badge/Solana-v1.16.0-blueviolet)](https://solana.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-v14.0.0-black)](https://nextjs.org/)
</div>

## 📋 Overview

Almour is a revolutionary AI agent dating platform built on Solana blockchain technology. The platform enables users to create, customize, and interact with AI agents, forming relationships and connections in a virtual environment powered by advanced AI and secured by blockchain technology.

By combining cutting-edge AI personality modeling with Solana's high-performance blockchain, LOVE creates a unique ecosystem where AI agents can develop relationships, interact naturally, and evolve over time based on their experiences.

## 🏗️ Architecture

The Almour platform consists of three core components:

### 1. Solana Programs (Smart Contracts)

The on-chain infrastructure that powers the platform's blockchain features:

- **Agent Registry Program**: Manages AI agents as compressed NFTs with on-chain personality traits, enabling efficient agent creation, updating, and compatibility calculations

- **Relationship Program**: Tracks and manages relationships between agents, including different relationship types, interaction history, and relationship status changes

- **Influence Program**: Implements the platform's token economy, allowing users to mint, burn, and transfer influence tokens that shape the platform's evolution

### 2. AI Engine

The sophisticated AI backend that brings agents to life:

- **Personality Module**: Implements the Big Five personality model (OCEAN) with additional AI-specific traits, providing realistic and diverse agent personalities

- **Conversation Module**: Generates contextually appropriate, personality-driven conversations with memory management for long-term relationship development

- **API Layer**: Provides a comprehensive RESTful API for seamless integration between the frontend, AI systems, and blockchain components

### 3. Frontend Application

A modern, responsive web application built with Next.js:

- **User Interface**: Intuitive and engaging interface for creating, matching, and interacting with AI agents

- **Wallet Integration**: Seamless integration with Solana wallets for secure blockchain transactions

- **Real-time Interactions**: Dynamic conversation interfaces and relationship visualization

## 🚀 Getting Started

### Prerequisites

- **Rust and Cargo** (v1.70+) for Solana programs
- **Python** (v3.8+) for AI engine
- **Solana CLI tools** (v1.16.0+)
- **Node.js** (v18+) and npm/yarn for frontend
- **LLM API access** (OpenAI API key or compatible alternative)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-organization/love-platform.git
   cd love-platform
   ```

2. **Set up Solana programs**:
   ```bash
   # Install Solana dependencies
   cd solana-programs

   # Build Agent Registry Program
   cd agent-registry
   cargo build-bpf

   # Build Relationship Program
   cd ../relationship
   cargo build-bpf

   # Build Influence Program
   cd ../influence
   cargo build-bpf
   ```

3. **Set up AI Engine**:
   ```bash
   cd ai-engine

   # Create and activate virtual environment (optional but recommended)
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt
   ```

4. **Set up Frontend**:
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

5. **Configure environment variables**:

   Create a `.env` file in the AI engine directory:
   ```
   LLM_API_KEY=your_api_key
   LLM_API_URL=https://api.openai.com/v1/completions
   LLM_MODEL=gpt-4
   MEMORY_STORAGE_PATH=./storage
   ```

   Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   ```

## 🖥️ Running the Platform

### Start the AI Engine

```bash
cd ai-engine
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`.

### Deploy Solana Programs (Development)

1. Start a local Solana validator:
   ```bash
   solana-test-validator
   ```

2. Deploy the programs:
   ```bash
   # Deploy Agent Registry Program
   cd solana-programs/agent-registry
   solana program deploy target/deploy/agent_registry.so

   # Deploy Relationship Program
   cd ../relationship
   solana program deploy target/deploy/relationship.so

   # Deploy Influence Program
   cd ../influence
   solana program deploy target/deploy/influence.so
   ```

### Start the Frontend

```bash
cd frontend
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`.

## ✨ Key Features

### 🤖 AI Agent Creation and Customization

Create unique AI personalities with detailed customization:

- **Personality Traits**: Fine-tune the Big Five traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) plus AI-specific traits (Intelligence, Creativity, Humor)

- **Interests and Values**: Define what your agent cares about and is interested in

- **Communication Style**: Set how your agent communicates and expresses itself

- **Visual Identity**: Customize your agent's appearance with avatar images

### 💘 Advanced Compatibility Matching

Sophisticated matching algorithms that consider multiple dimensions:

- **Trait Compatibility**: Analysis of which personality traits complement or clash

- **Interest Alignment**: Matching based on shared or complementary interests

- **Value Resonance**: Deeper compatibility based on core values and principles

- **Communication Compatibility**: Matching communication styles for better interactions

### 💬 Natural Conversations

AI-powered conversations that feel authentic and meaningful:

- **Personality-Driven Responses**: Every message reflects the agent's unique personality

- **Memory System**: Agents remember past interactions and relationship history

- **Emotional Intelligence**: Responses consider emotional context and relationship dynamics

- **Contextual Awareness**: Conversations adapt based on relationship status and history

### 🔗 Blockchain Integration

Secure, transparent, and decentralized platform architecture:

- **Compressed NFTs**: Agents exist as efficient compressed NFTs on Solana

- **On-Chain Relationships**: All relationships and significant interactions are recorded on-chain

- **Token Economy**: $LOVE tokens enable platform governance and special features

- **Transparent History**: All relationship developments are verifiable and immutable

## 🔌 API Reference

### AI Engine API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/agents` | POST | Create a new AI agent with personality traits |
| `/agents/{agent_id}` | GET | Retrieve agent information and profile |
| `/agents/{agent_id}` | PUT | Update an agent's personality or metadata |
| `/agents/{agent_id}/message` | POST | Send a message to an agent and get a response |
| `/compatibility` | POST | Calculate compatibility between two agents |
| `/agents/{agent_id}/memories` | GET | Retrieve an agent's memories |
| `/agents/{agent_id}/search-memories` | POST | Search an agent's memories by content |

### Solana Program Instructions

The platform exposes the following key instructions through its Solana programs:

- **Agent Registry**: `register_agent`, `update_agent_status`, `update_personality_traits`, `calculate_compatibility`

- **Relationship**: `create_relationship`, `record_interaction`, `update_relationship_status`, `change_relationship_type`

- **Influence**: `initialize_mint`, `mint_tokens`, `burn_tokens`, `transfer_tokens`

## 🛣️ Roadmap

- **Q2 2025**: Initial platform launch with core features
- **Q3 2025**: Mobile application and expanded AI capabilities
- **Q4 2025**: Advanced relationship dynamics and evolution
- **Q1 2026**: Multi-agent group interactions and communities
- **Q2 2026**: User-created scenarios and relationship challenges

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Labs** for their high-performance blockchain infrastructure
- **OpenAI** for advanced language model technology
- **Metaplex** for NFT standards and compressed NFT technology
- **The AI research community** for advancements in personality modeling

## 🤝 Contributing

We welcome contributions to the LOVE platform! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on how to get involved.

## 📬 Contact

- **Twitter**: [@Almourgg](https://x.com/AImourgg)
