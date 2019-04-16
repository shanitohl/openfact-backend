'use strict'

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require('cors');

const ProductCtrl = require("./Controllers/Product");
const DocumentCtrl = require("./Controllers/Document");
var path = require('path');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//console.log("antes Aqui no hay problemas");
// app.get("/api/product/:productId", ProductCtrl.getProduct);
// app.get("/api/product", ProductCtrl.getProducts);
// app.post("/api/product", ProductCtrl.saveProduct);
// app.put("/api/product/:productId", ProductCtrl.updateProduct);
// app.delete("/api/product/:productId", ProductCtrl.deleteProduct);

app.get("/api/test", (req, res) => {
    var mkdirp = require('mkdirp');

    console.log(process.cwd());
    console.log(process.chdir("./"));
    console.log(process.execPath);
    console.log(__dirname);
    console.log(path.dirname(__dirname+'/tmp'));

    mkdirp(__dirname+'/tmp', function (err) {
        if (err) console.error(err)
        else console.log('pow!')
    });
    res.status(200).send({ message: "Servidor Nodejs esta corriendo... carpeta creada" });
});

// app.get("/api/documents", DocumentCtrl.getDocuments);
//app.post("/api/documents/invoices", DocumentCtrl.getDocuments);

app.post("/api/organizations/:organization_name/documents/invoices", DocumentCtrl.getDocuments);


app.post("/api/organizations/:organization_name/excel", DocumentCtrl.getExcelDocument);
app.get("/api/organizations/:organization_name/sharedLinks", DocumentCtrl.getSharedDocument);

// (req, res) => {
//     console.log(req.params);
//     res.status(200).send({ message: req.params});
// });

// app.put('/users/:userId', (req, res) => { return res.send( `PUT HTTP method on user/${req.params.userId} resource`, ); });

module.exports = app;
