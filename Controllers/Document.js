'use strict'

const Product = require("../models/product");
const db = require("../db/index");

function getDocument(req, res) {
    let productId = req.params.productId;
    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({ mensagge: "Error al realizar la peticion" });
        if (!product) return res.status(404).send({ mensagge: "El producto no existe" });
        res.status(200).send({ product: product })
    })
}

function getDocuments(req, res) {   
    //client.connect()

    db.query("select d.id,d.document_id,d.issue_date,d.document_currency_code,a.value total,d.customer_assigned_account_id,d.customer_registration_name,d.baja_en_proceso,d.status from document d inner join document_attribute a on d.id = a.document_id and a.name= 'totalOperacionesGravadas' LIMIT 10 OFFSET 1;", (err, result) => {
        if (err) {
            console.log(err);
            return next(err)
          }
      console.log(result.rows.length)
      res.status(200).send(result.rows);
      //client.end()
    
    })
}

function saveDocument(req, res) {
    console.log("POST /api/product");
    console.log(req.body);

    let product = new Product();
    product.name = req.body.name;
    product.picture = req.body.picture;
    product.price = req.body.price;
    product.category = req.body.category;
    product.description = req.body.description;

    product.save((err, productStore) => {
        if (err) res.status(500).send("Error al salvar la base de datos." + err);
        res.status(200).send({ mensagge: "El producto se ha recibido", product: productStore });
    });
}

function updateDocument(req, res) {
    let productId = req.params.productId;
    console.log(req.body);
    let update = req.body;
    Product.findOneAndUpdate(productId, update, { new: true }, (err, productUpdated) => {
        if (err) return res.status(500).send({ mensagge: "Error al actualizar el dato" });
        res.status(200).send({ product: productUpdated })
    });
}

function deleteDocument(req, res) {
    let productId = req.params.productId;
    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({ mensagge: "Error al borrar el dato" });
        if (!product) return res.status(404).send({ mensagge: "El producto no existe" });
        product.remove(err => {
            if (err) return res.status(500).send({ mensagge: "Error al borrar el producto" });
            res.status(200).send({ mensagge: "el prodcuto ha sido borrado" })
        })

    });
}

module.exports = {
    getDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    saveDocument
}