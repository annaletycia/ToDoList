const express = require("express");
const cors = require("cors");
const router = require("./router");

const app = express();

app.use(express.json()); //trabalha com dados em JSON
app.use(router); 
app.use(cors()); //acesso liberado da API para todos

module.exports = app;