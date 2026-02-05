"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config import settings
from db import create_db_and_tables
from services.reminder_checker import reminder_checker
from services.kafka_producer import event_producer

# Create rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print(f"Starting {settings.APP_NAME}...")
    # Note: Use Alembic migrations in production
    # create_db_and_tables()

    # Start reminder checker if Resend API key is configured
    if settings.RESEND_API_KEY:
        reminder_checker.start()
        print("Reminder checker scheduler started")
    else:
        print("Reminder checker disabled (RESEND_API_KEY not configured)")

    # Start Kafka event producer (Dapr sidecar)
    await event_producer.start()
    print("Kafka event producer started (Dapr Pub/Sub)")

    yield

    # Shutdown
    print(f"Shutting down {settings.APP_NAME}...")
    await event_producer.stop()
    reminder_checker.stop()


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Todo Chatbot with natural language task management",
    version="1.0.0",
    lifespan=lifespan,
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "app": settings.APP_NAME}


# Manual reminder check endpoint (for external cron services)
@app.post("/api/reminders/check")
async def trigger_reminder_check():
    """
    Manually trigger reminder check.
    Use this endpoint with an external cron service (like cron-job.org)
    to ensure reminders are checked even when the server spins down.
    """
    try:
        await reminder_checker.check_and_send_reminders()
        return {"status": "success", "message": "Reminder check completed"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "health": "/health"
    }


# Import and register routers
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.tasks import router as tasks_router
from routes.tags import router as tags_router
from routes.recurring_tasks import router as recurring_tasks_router
from routes.audit import router as audit_router
from routes.events import router as events_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(tags_router, prefix="/api/tags", tags=["Tags"])
app.include_router(recurring_tasks_router, prefix="/api/recurring-tasks", tags=["Recurring Tasks"])
app.include_router(audit_router, prefix="/api/audit", tags=["Audit"])
app.include_router(events_router, tags=["Events"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
