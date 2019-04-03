'use strict'

const Product = require("../models/product");
const db = require("../db/index");
const serviceExcel = require("../Services/ExcelDocument");
const querys = require("../db/queries");
// const excel = require('./node-excel-export');


function getDocument(req, res) {
    let productId = req.params.productId;
    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({ mensagge: "Error al realizar la peticion" });
        if (!product) return res.status(404).send({ mensagge: "El producto no existe" });
        res.status(200).send({ product: product })
    })
}

function getDocuments(req, res) {
    //client.connect("POST /api/documents");
    console.log(req.body.paging)
    let paging = req.body.paging;
    let organization_id = "fa8825af-efc5-4aaf-b06e-cd243a1ac89b";
    let totalSize = 0;
    db.query(querys.getQueryCountDocumentsByOrganization(organization_id), (err, result) => {
        if (err) {
            console.log(err);
            return next(err)
        }
        console.log(result.rows[0].count);
        db.query(querys.getQuerySelectAllDocuments(organization_id, paging.pageSize, paging.page), (err, result) => {
            if (err) {
                console.log(err);
                return next(err)
            }
            console.log(result.rows.length)
            res.status(200).send({ totalSize: totalSize, items: result.rows });
            //client.end()        
        })
    });


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

function getExcelDocument(req, res) {
    console.log(req.body)
    let organization_name = req.params.organization_name;
    //= "fa8825af-efc5-4aaf-b06e-cd243a1ac89b";
    db.query(querys.getQueryFindOrganization(organization_name), (err, result1) => {
        if (err) {
            console.log(err);
            return next(err)
        }
        let organization_id = result1.rows[0].id;
        //console.log(result1);
        db.query(querys.getQueryReportVentas(organization_id, req.body.dateFrom, req.body.dateTo), (err, result) => {
            if (err) {
                console.log(err);
                //return next(err)
            }
            console.log(result.rows.length);
            let workbook = serviceExcel.createExcelDocument(result.rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
            workbook.xlsx.write(res)
                .then(function (data) {
                    res.end();
                    console.log('File write done........');
                });
            // You can then return this straight
            //res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
            //res.end();
            //return res.status(200).send(serviceExcel.createExcelDocument(result.rows));
        })
    });

    // let productId = req.params.productId;
    // Product.findById(productId, (err, product) => {
    //     if (err) return res.status(500).send({ mensagge: "Error al borrar el dato" });
    //     if (!product) return res.status(404).send({ mensagge: "El producto no existe" });
    //     product.remove(err => {
    //         if (err) return res.status(500).send({ mensagge: "Error al borrar el producto" });
    //         res.status(200).send({ mensagge: "el prodcuto ha sido borrado" })
    //     })

    // });
}


module.exports = {
    getDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    saveDocument,
    getExcelDocument
}