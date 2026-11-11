import sys
from os.path import abspath, dirname

# Add backend directory to sys.path
sys.path.append(dirname(dirname(abspath(__file__))))

from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Import your Base and models for autogenerate support
from app.database.base import Base
from app.models.identity import Profile, FacultyProfile, StudentProfile
from app.models.institution import Department, DepartmentHODAssignment, Program, Batch, Section
from app.models.assignments import Subject, SubjectOffering, TeachingAssignment, SectionMentorAssignment

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.connect() as context_connection:
        context.run_migrations(connection_context=context_connection)

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as context_connection:
        context.configure(
            connection=context_connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()