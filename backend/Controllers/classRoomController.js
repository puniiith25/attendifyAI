import { pool } from "../Database/db.js";

export const createClassroom = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can create classroom" });
        }

        const { room_number, building, capacity } = req.body;

        const result = await pool.query(
            `INSERT INTO classrooms (room_number,building,capacity)
       VALUES ($1,$2,$3)
       RETURNING *`,
            [room_number, building, capacity]
        );

        res.json({
            message: "Classroom created",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllClassrooms = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT * FROM classrooms ORDER BY room_number`
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateClassroom = async (req, res) => {
    try {

        const { id } = req.params;
        const { room_number, building, capacity } = req.body;

        const result = await pool.query(
            `UPDATE classrooms
       SET room_number=$1, building=$2, capacity=$3
       WHERE id=$4
       RETURNING *`,
            [room_number, building, capacity, id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteClassroom = async (req, res) => {
    try {

        const { id } = req.params;

        await pool.query(
            `DELETE FROM classrooms WHERE id=$1`,
            [id]
        );

        res.json({ message: "Classroom deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};