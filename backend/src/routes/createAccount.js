const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const bscrypt = require("bcryptjs");
const config = require("../config.json");

const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new Database(config["databaseName"]);

const tableName = config["tableName"];

app.post("/createaccount", async (req, res) => {
    try {
        const data = req.body;

        const password = data.password;
        const username = data.username;

        if (password) {
            if (password.length < 5) {
                return res.send({ success: false, cause: "Password should be more than 5 characters in length!" })
            } else if (password.length > 30) return res.send({ success: false, cause: "Password should be lesser than 30 characters in length!" })
        } else return res.send({ success: false, cause: "No password provided!" })

        if (username) {
            if (username.length < 5) {
                return res.send({ success: false, cause: "Username should be more than 5 characters in length!" })
            } else if (username.length > 30) return res.send({ success: false, cause: "Username should be lesser than 30 characters in length!" })
        } else return res.send({ success: false, cause: "No username provided!" })

        const usernameSelectStatement = db.prepare(`SELECT * FROM ${tableName} WHERE username = ?`);
        const usernameData = usernameSelectStatement.get(username);

        if (usernameData) {
            res.send({
                success: false,
                cause: "User with the same username already exists!",
            });
            return
        }

        const encryptedPassword = await bscrypt.hash(password, 10)

        const insertStatement = db.prepare(`INSERT INTO ${tableName} VALUES (?, ?)`);
        insertStatement.run(encryptedPassword, username);

        res.send({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            cause: JSON.stringify(err),
        });
    }
});

module.exports = app;