const express = require("express");
const router = express.Router();
const db = require("../db_connection").pool;

router.get("/", (req, res, next) => {

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query("SELECT * FROM User", (error, result, field) => {
            con.release();

            if (error)
                return res.status(500).send({ error: error });

            res.status(200).send({
                count: result.length,
                users: result
            });
        });
    });

});

router.get("/:id/:pass", (req, res, next) => {

    const id = req.params.id;
    const pass = req.query.pass;

    db.getConnection((error, con) => {
        if (error)
            return res.status(500).send({ error: error });

        con.query(
            "SELECT * FROM User WHERE email = ? AND password = ?",
            [id, pass],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                if (result == 0)
                    return res.status(404).send({ mensage: 'Não encontrado.', email: id, pass: pass, result: result });

                res.status(200).send({ user: result });
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
            `INSERT INTO User (email, password, picture, name, curJob, phone, summary, hasCollege, salaryClt, salaryPj, linkedin, github, portfolio) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                obj.email,
                obj.password,
                obj.picture,
                obj.name,
                obj.curJob,
                obj.phone,
                obj.summary,
                obj.hasCollege,
                obj.salaryClt,
                obj.salaryPj,
                obj.linkedin,
                obj.github,
                obj.portfolio,
            ],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(201).send({ message: "Cadastrado com sucesso.", id: result.email });
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
            `UPDATE User 
                SET picture = ?, 
                    name = ?, 
                    curJob = ?, 
                    phone = ?, 
                    summary = ?, 
                    hasCollege = ?, 
                    salaryClt = ?, 
                    salaryPj = ?, 
                    linkedin = ?, 
                    github = ?, 
                    portfolio = ? 
              WHERE email = ?`,
            [
                obj.picture,
                obj.name,
                obj.curJob,
                obj.phone,
                obj.summary,
                obj.hasCollege,
                obj.salaryClt,
                obj.salaryPj,
                obj.linkedin,
                obj.github,
                obj.portfolio,
                id,
            ],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(202).send({ message: "Alterado com sucesso.", id: result.email });
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
            " DELETE FROM User WHERE email = ?",
            [id],
            (error, result, field) => {
                con.release();

                if (error)
                    return res.status(500).send({ error: error });

                res.status(202).send({ message: "Removido com sucesso.", id: result.email });
            }
        );
    });

});

module.exports = router;