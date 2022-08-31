const express = require("express");
const router = express.Router();
const db = require("../db_connection").pool;

router.get("/:id", (req, res, next) => {

    const id = req.params.id;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            "SELECT * FROM UserTest WHERE userEmail = ?", [id],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                if (result == 0)
                    return res.status(404).send({ mensage: 'Não encontrado.', result: result });

                res.status(200).send({ list: result });
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
            `INSERT INTO UserTest (userEmail, testId, score, date) VALUES (?, ?, ?, ?)`,
            [obj.userEmail, obj.testId, obj.score, obj.date],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(201).send({ message: "Cadastrado com sucesso." });
            }
        );
    });

});

router.patch("/:id", (req, res, next) => {

    const id = req.params.id;
    const obj = req.body;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            `UPDATE UserTest 
                SET score = ?, 
                    date = ?
              WHERE userEmail = ? AND testId = ?`,
            [
                obj.score,
                obj.date,
                id,
                obj.testId,
            ],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(202).send({ message: "Alterado com sucesso." });
            }
        );
    });

});

router.delete("/:id", (req, res, next) => {

    const id = req.params.id;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            " DELETE FROM UserTest WHERE userEmail = ?",
            [id],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(202).send({ message: "Removido com sucesso." });
            }
        );
    });

});

module.exports = router;