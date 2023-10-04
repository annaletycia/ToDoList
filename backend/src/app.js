const express = require("express");
const corsMiddleware = require("./middlewares/cors");
const router = require("./router");

const app = express();

app.use(express.json()); //trabalha com dados em JSON
app.use(corsMiddleware); // Middleware para permitir solicitações de qualquer origem
app.use(router); 

// App.use(corsMiddleware) já está realizando isso:
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // Permitir qualquer origem (em produção, defina uma origem específica)
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

module.exports = app;