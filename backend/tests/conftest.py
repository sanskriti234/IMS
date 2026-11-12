import asyncio
import os
import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(
        asyncio.WindowsSelectorEventLoopPolicy()
    )

import pytest_asyncio

from httpx import ASGITransport, AsyncClient

from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.main import app
import app.main as main_module

from app.core.config import settings
from app.database.session import get_db


TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

if not TEST_DATABASE_URL:
    raise RuntimeError(
        "TEST_DATABASE_URL is required. "
        "Set it to a dedicated PostgreSQL test database."
    )


def database_identity(url: str):
    parsed = make_url(url)

    return (
        parsed.host,
        parsed.port,
        parsed.database,
    )


if database_identity(TEST_DATABASE_URL) == database_identity(
    settings.DATABASE_URL
):
    raise RuntimeError(
        "The test database must not be the application database."
    )


@pytest_asyncio.fixture
async def client():

    test_engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
    )

    try:
        async with test_engine.connect() as connection:

            outer_transaction = await connection.begin()

            TestSessionLocal = async_sessionmaker(
                bind=connection,
                class_=AsyncSession,
                expire_on_commit=False,
                autoflush=False,
                join_transaction_mode="create_savepoint",
            )

            async def override_get_db():
                async with TestSessionLocal() as session:
                    try:
                        yield session
                        await session.commit()

                    except Exception:
                        await session.rollback()
                        raise

            app.dependency_overrides[get_db] = override_get_db

            # Health-check endpoint uses AsyncSessionLocal directly.
            # Point it to the same isolated test connection.
            original_session_factory = main_module.AsyncSessionLocal
            main_module.AsyncSessionLocal = TestSessionLocal

            try:
                async with AsyncClient(
                    transport=ASGITransport(app=app),
                    base_url="http://test",
                ) as test_client:

                    yield test_client

            finally:
                app.dependency_overrides.clear()
                main_module.AsyncSessionLocal = (
                    original_session_factory
                )

                if outer_transaction.is_active:
                    await outer_transaction.rollback()

    finally:
        await test_engine.dispose()