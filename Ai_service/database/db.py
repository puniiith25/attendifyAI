import psycopg2
from psycopg2 import pool
import os
import numpy as np
import json
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("SUPABASE_DB_URL")

db_pool = psycopg2.pool.SimpleConnectionPool(
    1,
    10,
    DATABASE_URL,
    connect_timeout=10,
    sslmode="require"

)

def load_section_embeddings(section_id: str):

    conn = db_pool.getconn()

    try:

        cur = conn.cursor()

        cur.execute(
            """
            SELECT student_id, embedding
            FROM student_faces
            WHERE section_id = %s
            """,
            (section_id,)
        )

        rows = cur.fetchall()

        students = []

        for r in rows:

            students.append({
                "student_id": r[0],
                "embedding": np.array(json.loads(r[1]), dtype=np.float32)
            })

        return students

    finally:

        cur.close()
        db_pool.putconn(conn)