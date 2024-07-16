import { pool } from "../config/db.js";

let addUserQuery = async (name,email,password) => {
    try {
        let sql = {
            text : "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
            values : [name,email,password]
        }
        let result = await pool.query(sql)
        if (result.rowCount > 0) {
            return result.rows[0];
        } else {
            return new Error("Error! unable to register...");
        }
    } catch (error) {
        console.log(error)
        console.log(error.code)
        console.log(error.message)
    }
}

let verifyUserQuery = async (email) => {
    try {
        let sql = {
            text : "SELECT * FROM users WHERE email = $1",
            values : [email]
        }
        let result = await pool.query(sql)
        if (result.rowCount > 0) {
            return result.rows[0];
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
        console.log(error.code)
        console.log(error.message)
    }
}


export {
    addUserQuery,
    verifyUserQuery
}