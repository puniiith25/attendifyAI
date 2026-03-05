import express from "express";
import { pool } from "../Database/db.js";
import bcrypt from "bcrypt";


export const userRegister = async (req, res) => {
    const { name, email, password, role } = req.body

    try {
        const user = await pool.query("SELECT * From users WHERE email=$1", [email]);
        if (user.rows.length > 0) {
            return res.status(404).json({ message: "user already exist" });
        }
        const result = await pool.query(
            "INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4)",
            [name, email, hash, role]
        );


        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        
    }
}

export const userLogin = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const user = await pool.query("SELECT * From users WHERE email=$1", [email]);
        if (user.rows.length > 0) {
            return res.status(404).json({ message: "user already exist" });
        }
        const result = await pool.query(
            "INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4)",
            [name, email, hash, role]
        );


        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
}

