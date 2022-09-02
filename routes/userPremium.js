const express = require("express");
const router = express.Router();
const db = require("../db_connection").pool;

router.get("/:id", (req, res, next) => {

    const id = req.params.id;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            "SELECT endDate FROM UserPremium WHERE userEmail = ? AND endDate >= NOW() LIMIT 1", [id],
            (error, result) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(200).send({ premium: result ? result[0] : {} });
            }
        );
    });

});

router.post("/", (req, res, next) => {

    const obj = req.body;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            `INSERT INTO UserPremium (userEmail, endDate) VALUES (?, (NOW() + ?))`,
            [obj.userEmail, obj.days],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(201).send({ message: "Cadastrado com sucesso." });
            }
        );
    });

});

module.exports = router;