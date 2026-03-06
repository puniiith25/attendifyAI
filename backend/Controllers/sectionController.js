import { pool } from "../Database/db.js";

export const createSection = async (req, res) => {
    const { sec_name, academic_year } = req.body;
    try {
        if (!sec_name || !academic_year) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const sec = await pool.query("SELECT sec_name From sections WHERE sec_name=$1", [sec_name]);
        if (sec.rowCount > 0) {
            return res.status(409).json({ success: false, message: "Section name already exist" });
        }

        const result = await pool.query(
            `INSERT INTO sections (sec_name,academic_year)
       VALUES ($1,$2)`,
            [sec_name, academic_year]
        );

        res.json({ success: true, message: "section successfully created" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getSections = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM sections ORDER BY id ASC"
        );

        res.status(200).json({
            success: true,
            count: result.rowCount,
            sections: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getSingle_Section = async (req, res) => {

    const { sec_name } = req.params;

    try {

        const result = await pool.query(
            "SELECT sec_name ,academic_year FROM sections WHERE sec_name=$1",
            [sec_name]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        res.status(200).json({
            success: true,
            section: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};