const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const url = require("url");

const userRoute = require("./routes/user");
const testRoute = require("./routes/test");
const userTestRoute = require("./routes/userTest");
const userPremiumRoute = require("./routes/userPremium");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

//CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).send({});
    }
    next();
});

//Rotas
app.use("/user", userRoute);
app.use("/test", testRoute);
app.use("/usertest", userTestRoute);
app.use("/userpremium", userPremiumRoute);

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
