'use strict'

const Product = require("../models/product");

function getProduct(req, res) {
    let productId = req.params.productId;
    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({ mensagge: "Error al realizar la peticion" });
        if (!product) return res.status(404).send({ mensagge: "El producto no existe" });
        res.status(200).send({ product: product })
    })
}

function getProducts(req, res) {  
    Product.find({}, (err, products) => {
        if (err) return res.status(500).send({ mensagge: "Error al realizar la peticion" });
        if (!products) return res.status(404).send({ mensagge: "los productos no existen" });
        res.status(200).send({products});
    })
}

function saveProduct(req, res) {
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

function updateProduct(req, res) {
    let productId = req.params.productId;
    console.log(req.body);
    let update = req.body;
    Product.findOneAndUpdate(productId, update, { new: true }, (err, productUpdated) => {
        if (err) return res.status(500).send({ mensagge: "Error al actualizar el dato" });
        res.status(200).send({ product: productUpdated })
    });
}

function deleteProduct(req, res) {
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
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    saveProduct
}