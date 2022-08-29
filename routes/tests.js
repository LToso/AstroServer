const express = require("express");
const router = express.Router();
const db = require("../db_connection").pool;

router.get("/", (req, res, next) => {

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query("SELECT * FROM Test", (error, result, field) => {
            con.release();

            if (error)
                return res.status(500).send({ error: error });

            res.status(200).send({
                count: result.length,
                list: result
            });
        });
    });

});

router.get("/:id", (req, res, next) => {

    const id = req.params.id;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            "SELECT * FROM TestQuestion WHERE testId = ? ",
            [id],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                if (result == 0)
                    return res.status(404).send({ mensage: 'Não encontrado.', result: result });

                res.status(200).send({
                    count: result.length,
                    list: result
                });
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
            `INSERT INTO Test (name, about, type, time) 
            VALUES (?, ?, ?, ?)`,
            [
                obj.name,
                obj.about,
                obj.type,
                obj.time
            ],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });


                res.status(201).send({ message: "Cadastrado com sucesso." });
            }
        );
    });

});

router.post("/:id", (req, res, next) => {

    const id = req.params.id;
    const obj = req.body;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            `INSERT INTO TestQuestion (testId, question, option1, option2, option3, option4, option5, answer) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                obj.question,
                obj.option1,
                obj.option2,
                obj.option3,
                obj.option4,
                obj.option5,
                obj.answer,
            ],
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
            `UPDATE Test 
                SET name = ?, 
                    about = ?, 
                    type = ?, 
                    time = ?
              WHERE id = ?`,
            [
                obj.name,
                obj.about,
                obj.type,
                obj.time,
                id,
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
            "DELETE FROM TestQuestion WHERE testId = ?",
            [id, id],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(202).send({ message: "Removido com sucesso." });
            }
        );
    });

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            "DELETE FROM Test WHERE id = ?",
            [id, id],
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