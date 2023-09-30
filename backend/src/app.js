const express = require("express");
const router = require("./router");

const app = express();

app.use(express.json()); //trabalha com dados em JSON
app.use(router); 

module.exports = app;