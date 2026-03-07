import { pool } from "../Database/db.js";

/* =========================================
CREATE CLASSROOM
========================================= */

export const createClassroom = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create classroom"
            });
        }

        const { room_number, building, capacity } = req.body;

        if (!room_number || !building || !capacity) {
            return res.status(400).json({
                success: false,
                message: "room_number, building and capacity are required"
            });
        }

        const duplicate = await pool.query(
            "SELECT id FROM classrooms WHERE room_number=$1",
            [room_number]
        );

        if (duplicate.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Classroom already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO classrooms
            (room_number, building, capacity)
            VALUES ($1,$2,$3)
            RETURNING *`,
            [room_number, building, capacity]
        );

        res.status(201).json({
            success: true,
            message: "Classroom created successfully",
            classroom: result.rows[0]
        });

    } catch (error) {

        console.error("Create classroom error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =========================================
GET ALL CLASSROOMS
========================================= */

export const getAllClassrooms = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT 
                id,
                room_number,
                building,
                capacity
             FROM classrooms
             ORDER BY room_number`
        );

        res.json({
            success: true,
            count: result.rowCount,
            classrooms: result.rows
        });

    } catch (error) {

        console.error("Get classrooms error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =========================================
GET CLASSROOM BY ID
========================================= */

export const getClassroomById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM classrooms WHERE id=$1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Classroom not found"
            });
        }

        res.json({
            success: true,
            classroom: result.rows[0]
        });

    } catch (error) {

        console.error("Get classroom error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =========================================
UPDATE CLASSROOM
========================================= */

export const updateClassroom = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update classroom"
            });
        }

        const { id } = req.params;
        const { room_number, building, capacity } = req.body;

        const classroom = await pool.query(
            "SELECT * FROM classrooms WHERE id=$1",
            [id]
        );

        if (classroom.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Classroom not found"
            });
        }

        if (room_number) {

            const duplicate = await pool.query(
                "SELECT id FROM classrooms WHERE room_number=$1 AND id<>$2",
                [room_number, id]
            );

            if (duplicate.rowCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Room number already exists"
                });
            }

        }

        const result = await pool.query(
            `UPDATE classrooms
             SET room_number=$1,
                 building=$2,
                 capacity=$3
             WHERE id=$4
             RETURNING *`,
            [
                room_number || classroom.rows[0].room_number,
                building || classroom.rows[0].building,
                capacity || classroom.rows[0].capacity,
                id
            ]
        );

        res.json({
            success: true,
            message: "Classroom updated successfully",
            classroom: result.rows[0]
        });

    } catch (error) {

        console.error("Update classroom error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =========================================
DELETE CLASSROOM
========================================= */

export const deleteClassroom = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete classroom"
            });
        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM classrooms WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Classroom not found"
            });
        }

        res.json({
            success: true,
            message: "Classroom deleted successfully"
        });

    } catch (error) {

        console.error("Delete classroom error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};