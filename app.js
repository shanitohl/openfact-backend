'use strict'


const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const ProductCtrl = require("./Controllers/Product");
const DocumentCtrl = require("./Controllers/Document");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log("antes Aqui no hay problemas");
app.get("/api/product/:productId", ProductCtrl.getProduct);
app.get("/api/product", ProductCtrl.getProducts);
app.post("/api/product", ProductCtrl.saveProduct);
app.put("/api/product/:productId", ProductCtrl.updateProduct);
app.delete("/api/product/:productId", ProductCtrl.deleteProduct);

app.get("/api/test", (req, res) => {
    res.status(200).send({ message: "Servidor Nodejs esta corriendo..." });
});

app.get("/api/documents", DocumentCtrl.getDocuments);

module.exports = app;