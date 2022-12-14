const express = require("express");
const router = express.Router();
const db = require("../db_connection");

//Get All
router.get("/", async (req, res) => {

    var page = req.query.page;
    var lines = 10;

    if (!page || page < 1)
        page = 1;

    page = page - 1

    try {
        var users = await db.run(`SELECT u.*, NULL as password, if(p.endDate >= UNIX_TIMESTAMP(NOW()), true, false) isPremium 
                                    FROM User u LEFT JOIN UserPremium p ON u.email = p.userEmail 
                                    WHERE (SELECT 1 FROM UserTest t WHERE u.email = t.userEmail LIMIT 1)                                    
                                    AND (company IS NULL OR company = '')
                                    LIMIT ?, ?`, [page * lines, lines]);
        var total = await db.run(`SELECT count(1) total FROM User u WHERE (SELECT 1 FROM UserTest t WHERE u.email = t.userEmail LIMIT 1) AND (company IS NULL OR company = '')`, []);
        for (let i = 0; i < users.length; i++)
            users[i].test = await db.run(`SELECT u.*, t.picture, t.name FROM UserTest u 
                                          INNER JOIN Test t ON u.testId = t.id 
                                          WHERE userEmail = ? ORDER BY date DESC`, [users[i].email]);

        res.status(200).send({ users: users, total: total })
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

//SignIn and SignOn
router.post("/", async (req, res) => {
    try {
        var user = await db.run('SELECT *, NULL as password FROM User WHERE email = ? AND password = ?',
            [req.body.email, req.body.password]);
        var test = [];
        var premium = []
        if (user.length > 0) {
            test = await db.run('SELECT * FROM UserTest WHERE userEmail = ? ORDER BY date DESC',
                [req.body.email]);
            premium = await db.run('SELECT * FROM UserPremium WHERE userEmail = ? ORDER BY endDate DESC',
                [req.body.email]);
            res.status(200).send({ user, test, premium })
        }
        else {
            user = await db.run('INSERT INTO User (email, password, name, company) VALUES (?, ?, ?, ?)',
                [req.body.email, req.body.password, req.body.name, req.body.company]);
            res.status(200).send({ id: user.insertId, code: user.code });
        }
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

router.put("/", async (req, res) => {
    console.log(req.body)
    try {
        var user = await db.run(`UPDATE User SET picture = ? WHERE email = ?`, [req.body.picture, req.body.email]);
        res.status(200).send({ id: user.insertId, code: user.code });
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

router.patch("/", async (req, res) => {
    try {
        var user = await db.run(`UPDATE User SET name = ?, curJob = ?, address = ?,
                                                 phone = ?, summary = ?, available = ?, education = ?, expectedClt = ?,
                                                 expectedPj = ?, salaryClt = ?, salaryPj = ?, linkedin = ?, github = ?,
                                                 portfolio = ?, company = ?                                                    
                                 WHERE email = ?`,
            [req.body.name, req.body.curJob, req.body.address, req.body.phone,
            req.body.summary, req.body.available, req.body.education, req.body.expectedClt,
            req.body.expectedPj, req.body.salaryClt, req.body.salaryPj,
            req.body.linkedin, req.body.github, req.body.portfolio, req.body.company,
            req.body.email]);
        res.status(200).send({ id: user.insertId, code: user.code });
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

module.exports = router;