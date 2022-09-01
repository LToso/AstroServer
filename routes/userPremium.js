const express = require("express");
const router = express.Router();
const db = require("../db_connection").pool;

router.get("/:id", (req, res, next) => {

    const id = req.params.id;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            "SELECT * FROM UserPremium WHERE userEmail = ? AND endDate >= ?", [id, Date.now()],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                if (result == 0)
                    return res.status(404).send({ mensage: 'Não encontrado.', result: result });

                res.status(200).send({ premium: result });
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
            `INSERT INTO UserPremium (userEmail, endDate) VALUES (?, ?)`,
            [obj.userEmail, obj.endDate],
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