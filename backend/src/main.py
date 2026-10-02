"""
JAGA Backend - Graph Analytics-Based Healthcare Fraud Detection
Main FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting JAGA Backend...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Database: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    
    # TODO: Initialize database connection pool
    # TODO: Initialize graph database connection
    # TODO: Load ML models
    
    yield
    
    # Shutdown
    logger.info("Shutting down JAGA Backend...")
    # TODO: Close database connections
    # TODO: Cleanup resources


# Create FastAPI application
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "JAGA API",
        "version": settings.API_VERSION,
        "environment": settings.ENVIRONMENT
    }


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "not_implemented",  # TODO: Check DB connection
        "graph": "not_implemented",      # TODO: Check AGE connection
        "detection_engine": "not_implemented",
    }


# TODO: Import and include routers
# from src.api import networks, graph, stats, investigation
# app.include_router(networks.router, prefix="/api/networks", tags=["networks"])
# app.include_router(graph.router, prefix="/api/graph", tags=["graph"])
# app.include_router(stats.router, prefix="/api/stats", tags=["statistics"])
# app.include_router(investigation.router, prefix="/api/investigation", tags=["investigation"])


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD,
        log_level=settings.LOG_LEVEL.lower()
    )
