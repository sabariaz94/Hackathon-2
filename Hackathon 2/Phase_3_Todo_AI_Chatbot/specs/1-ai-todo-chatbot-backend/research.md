# Research: AI Todo Chatbot Backend

## Decision: OpenAI Agents SDK with OpenRouter Integration
**Rationale**: Using OpenAI Agents SDK with OpenRouter provides access to advanced AI models while maintaining flexibility in model selection. OpenRouter offers competitive pricing and supports multiple high-quality models like GPT-4, Claude, and others.
**Alternatives considered**:
- Direct OpenAI API calls (limited to OpenAI models)
- Self-hosted models (higher infrastructure costs)
- Other AI service providers (potentially less reliable)

## Decision: MCP SDK for Tool Definitions
**Rationale**: MCP SDK provides a standardized way to define stateless tools that the AI agent can call. This approach ensures proper separation of concerns between AI processing and business logic.
**Alternatives considered**:
- Custom function calling mechanisms (more complex maintenance)
- Direct API calls from agent (security concerns)
- Hardcoded tool functions (less flexible)

## Decision: SQLModel for Database Models
**Rationale**: SQLModel combines the power of SQLAlchemy with Pydantic, providing type safety and validation while maintaining compatibility with existing database infrastructure.
**Alternatives considered**:
- Pure SQLAlchemy (less type safety)
- Pydantic with separate ORM (more complex setup)
- Other ORMs (would require significant refactoring)

## Decision: Stateless Chat Endpoint Design
**Rationale**: A stateless design simplifies scaling and reduces memory usage by loading conversation history from the database on each request. This approach also makes the system more resilient to failures.
**Alternatives considered**:
- Session-based state management (more complex scaling)
- In-memory caching (potential data loss, scaling issues)
- Hybrid approach (increased complexity)

## Decision: JWT-Based Authentication
**Rationale**: Using existing JWT authentication ensures consistency with the current security model and maintains user isolation without requiring additional authentication infrastructure.
**Alternatives considered**:
- Custom authentication tokens (would require new infrastructure)
- OAuth integration (unnecessary complexity for this feature)
- API keys per user (not aligned with existing system)

## Decision: Neon Serverless PostgreSQL
**Rationale**: Using the existing Neon PostgreSQL database ensures compatibility with current infrastructure and maintains data consistency across the application.
**Alternatives considered**:
- Separate database instance (increased complexity)
- NoSQL solution (would require significant refactoring)
- In-memory store (not suitable for persistent conversation history)