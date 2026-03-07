import psycopg2
from psycopg2 import pool
import os
import numpy as np
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("SUPABASE_DB_URL")

if not DATABASE_URL:
    raise ValueError("SUPABASE_DB_URL not found in environment variables")

# connection pool (better for API servers)
db_pool = psycopg2.pool.SimpleConnectionPool(
    1,
    10,
    DATABASE_URL
)


def load_section_embeddings(section_id: str):

    conn = db_pool.getconn()

    try:

        cur = conn.cursor()

        cur.execute(
            """
            SELECT student_id, embedding_vector
            FROM face_embeddings
            WHERE section_id = %s
            """,
            (section_id,)
        )

        rows = cur.fetchall()

        students = []

        for r in rows:
            students.append({
                "student_id": r[0],
                "embedding": np.array(r[1])
            })

        return students

    finally:

        cur.close()
        db_pool.putconn(conn)