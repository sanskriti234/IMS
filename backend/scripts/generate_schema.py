
from pathlib import Path
import sys

from sqlalchemy import create_mock_engine

# Add backend directory to Python path
BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

# Import all models so they register with Base.metadata
import app.models
from app.database.base import Base


OUTPUT_DIR = BACKEND_DIR / "sql"
OUTPUT_FILE = OUTPUT_DIR / "coresight_schema.sql"

statements = []


def collect_sql(statement, *multiparams, **params):
    """Compile SQL statements without executing them."""
    compiled = statement.compile(
        dialect=engine.dialect,
        compile_kwargs={"literal_binds": True},
    )
    statements.append(str(compiled).strip() + ";")


# PostgreSQL mock engine: no database connection is created.
engine = create_mock_engine(
    "postgresql://",
    collect_sql,
)

# Generate PostgreSQL DDL from registered ORM metadata.
Base.metadata.create_all(engine)

# Add the Supabase Auth relationship separately.
# profiles.id must match auth.users.id.
auth_fk_sql = """
ALTER TABLE public.profiles
ADD CONSTRAINT fk_profiles_auth_user
FOREIGN KEY (id)
REFERENCES auth.users (id)
ON DELETE RESTRICT;
"""

header = """-- CoreSight SIS PostgreSQL Schema
-- Generated from SQLAlchemy ORM metadata.
-- Review this file before executing it in Supabase SQL Editor.
-- This script does not create or connect to a database.

SET search_path TO public;

"""

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

with OUTPUT_FILE.open("w", encoding="utf-8") as file:
    file.write(header)
    file.write("\n\n".join(statements))
    file.write("\n\n-- Supabase Auth foreign key\n")
    file.write(auth_fk_sql.strip() + "\n")

print("Schema generation completed.")
print(f"Registered tables: {len(Base.metadata.tables)}")
print(f"Output file: {OUTPUT_FILE}")
