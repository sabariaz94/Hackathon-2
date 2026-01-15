"""
Todo API - Main application entry point

FastAPI application providing RESTful todo management with JWT authentication.
Features:
- Create, read, update, delete todos
- JWT-based authentication with user sessions
- Google OAuth integration
- Health check endpoint for monitoring
- Auto-generated interactive API docs at /docs
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import todos, auth

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI application instance
app = FastAPI(
    title="Todo API",
    description="RESTful API for managing todo items with JWT authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# Configure CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development server
        "http://127.0.0.1:3000",  # Alternative localhost format
        "http://localhost:3001",  # Alternative port for Next.js
        "http://127.0.0.1:3001",  # Alternative localhost with port 3001
        "http://localhost:3002",  # Additional port for Next.js
        "http://127.0.0.1:3002",  # Alternative localhost with port 3002
        "http://0.0.0.0:3000",   # Docker/WSL compatibility
        "http://0.0.0.0:3001",   # Docker/WSL compatibility
        "http://0.0.0.0:3002",   # Docker/WSL compatibility
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PATCH, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include auth routes
app.include_router(auth.router)

# Include todo routes (protected)
app.include_router(todos.router)

@app.on_event("startup")
async def startup_event():
    """Application startup event handler"""
    logger.info("Todo API starting up with JWT authentication...")
    logger.info("Server running on http://localhost:8000")
    logger.info("Interactive API docs available at http://localhost:8000/docs")
    logger.info("API endpoints available at /api")


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event handler"""
    logger.info("Todo API shutting down...")


@app.get("/health", tags=["health"], summary="Health check")
async def health_check():
    """
    Health check endpoint for monitoring

    Returns:
        dict: Server health status

    This endpoint is used by monitoring systems and deployment tools
    to verify the API server is running and responsive.
    """
    return {"status": "healthy"}
