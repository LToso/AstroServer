const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const url = require("url");

const usersRoute = require("./routes/users");
const testsRoute = require("./routes/tests");
const usersTestRoute = require("./routes/usersTest");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).send({});
    }
    next();
});

//Rotas
app.use("/user", usersRoute);
app.use("/test", testsRoute);
app.use("/usertest", usersTestRoute);

//Erro API
app.use((req, res, next) => {
    const erro = new Error("Não encontrado");
    erro.status = 404;
    next(erro);
});

//Erro Generico
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            message: error.message,
        },
    });
});

module.exports = app;
