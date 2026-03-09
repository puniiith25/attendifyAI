import { pool } from "../Database/db.js";


/* =========================================
CREATE SECTION
========================================= */

export const createSection = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create section"
            });
        }

        let {
            sec_name,
            department,
            semester,
            capacity,
            class_teacher
        } = req.body;

        if (!sec_name || !department || !semester || !capacity) {
            return res.status(400).json({
                success: false,
                message: "sec_name, department, semester and capacity are required"
            });
        }

        sec_name = sec_name.trim().toUpperCase();

        const existing = await pool.query(
            "SELECT id FROM sections WHERE sec_name=$1 AND semester=$2",
            [sec_name, semester]
        );

        if (existing.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Section already exists for this semester"
            });
        }

        if (class_teacher) {

            const teacher = await pool.query(
                "SELECT id FROM teachers WHERE id=$1",
                [class_teacher]
            );

            if (teacher.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Class teacher not found"
                });
            }

        }

        const result = await pool.query(
            `INSERT INTO sections
            (sec_name, department, semester, capacity, class_teacher)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                sec_name,
                department,
                semester,
                capacity,
                class_teacher || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Section created successfully",
            section: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =========================================
GET ALL SECTIONS
========================================= */

export const getSections = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                s.id,
                s.sec_name,
                s.department,
                s.semester,
                s.capacity,
                u.name AS class_teacher
            FROM sections s
            LEFT JOIN teachers t ON s.class_teacher = t.id
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY s.id ASC
        `);

        res.json({
            success: true,
            count: result.rowCount,
            sections: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =========================================
GET SINGLE SECTION
========================================= */

export const getSingleSection = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                s.*,
                u.name AS class_teacher_name
            FROM sections s
            LEFT JOIN teachers t ON s.class_teacher = t.id
            LEFT JOIN users u ON t.user_id = u.id
            WHERE s.id=$1
        `, [id]);

        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Section not found"
            });

        }

        res.json({
            success: true,
            section: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =========================================
UPDATE SECTION
========================================= */

export const updateSection = async (req, res) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Only admin can update section"
            });

        }

        const { id } = req.params;

        const {
            sec_name,
            department,
            semester,
            capacity,
            class_teacher
        } = req.body;

        const section = await pool.query(
            "SELECT * FROM sections WHERE id=$1",
            [id]
        );

        if (section.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Section not found"
            });

        }

        const result = await pool.query(
            `UPDATE sections
             SET sec_name=$1,
                 department=$2,
                 semester=$3,
                 capacity=$4,
                 class_teacher=$5
             WHERE id=$6
             RETURNING *`,
            [
                sec_name || section.rows[0].sec_name,
                department || section.rows[0].department,
                semester || section.rows[0].semester,
                capacity || section.rows[0].capacity,
                class_teacher || section.rows[0].class_teacher,
                id
            ]
        );

        res.json({
            success: true,
            message: "Section updated successfully",
            section: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};



/* =========================================
DELETE SECTION
========================================= */

export const deleteSection = async (req, res) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Only admin can delete section"
            });

        }

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM sections WHERE id=$1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Section not found"
            });

        }

        res.json({
            success: true,
            message: "Section deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};