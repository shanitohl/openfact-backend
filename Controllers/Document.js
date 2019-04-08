'use strict'

const Product = require("../models/product");
const db = require("../db/index");
const serviceExcel = require("../Services/ExcelDocument");
const querys = require("../db/queries");
const fs = require('fs');
const uuidv1 = require('uuid/v1');
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
    db.query(querys.getQueryFindOrganization(organization_name, "master"), (err, result1) => {
        if (err) {
            console.log(err);
            return next(err)
        }
        let organization_id = getOrganizationMaster(result1.rows, false, organization_name).id;//result1.rows[0].id;
        let organization_id_storage = organization_id;
        let isMasterStoreage = result1.rows[0].is_master_storage;
        if (isMasterStoreage == '1') {
            organization_id_storage = getOrganizationMaster(result1.rows, true, organization_name).id;
        }
        db.query(querys.getQueryFindOrganizationStorageConfig(organization_id_storage), (err, ressult2) => {
            if (err) {
                console.log(err);
                return;
                //return next(err)
            };
            let accessToken = getValueList(ressult2.rows, "DbxAccessToken").value;//ressult2.rows[0].value;
            let clientIdentifier = getValueList(ressult2.rows, "DbxClientIdentifier").value;//ressult2.rows[1].value;
            let userId = getValueList(ressult2.rows, "DbxUserId").value;//ressult2.rows[2].value;
            db.query(querys.getQueryReportVentas(organization_id, req.body.dateFrom, req.body.dateTo), (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                    //return next(err)
                }
                console.log(result.rows.length);
                let workbook = serviceExcel.createExcelDocument(result.rows, organization_name, "Mi Razon Social", req.body.dateFrom + " - " + req.body.dateTo);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                let fileName = organization_name + '_' + new Date().toISOString().replace(':', '').replace(':', '').replace('.', '');
                workbook.xlsx.writeFile('./FilesGenerate/' + fileName + '.xlsx').then((buffer) => {
                    console.log("file is written in ./FilesGenerate/" + fileName + ".xlsx for ID:" + organization_id);

                    require('isomorphic-fetch'); // or another library of choice.
                    var Dropbox = require('dropbox').Dropbox;
                    console.log(process.env.DBX_API_TOKEN);
                    var dbx = new Dropbox({ accessToken: process.env.DBX_API_TOKEN });

                    fs.readFile('./FilesGenerate/' + fileName + '.xlsx', function (err, contents) {
                        dbx.filesUpload({ path: '/ReportVentasOpenfact/' + fileName + ".xlsx", contents: contents })
                            .then(function (response) {
                                //var results = document.getElementById('results');
                                //results.appendChild(document.createTextNode('File uploaded!'));
                                console.log(response);
                                let shared_link_metadata = dbx.sharingCreateSharedLink({ path: '/ReportVentasOpenfact/' + fileName + ".xlsx", short_url: false }).then(function (responseDb) {
                                    console.log("Url document : " + responseDb.url);
                                    const query = {
                                        text: 'INSERT INTO organization_sales(id,organization_id,file_name,shared_url,date_from,date_to,created_timestamp) VALUES($1, $2,$3, $4,$5, $6,$7);',
                                        values: [uuidv1(), organization_id, fileName + ".xlsx", responseDb.url, req.body.dateFrom, req.body.dateTo, new Date()],
                                    }
                                    db.query(query, (err, res) => {
                                        if (err) {
                                            console.log(err.stack)
                                        } else {
                                            console.log(res)
                                        }
                                    })

                                });

                            })
                            .catch(function (error) {
                                console.error(error);
                            });
                    });
                    res.status(200).send({ mensagge: "Se genero correctamente el archivo, espere unos momentos por favor..." });
                });
                // dbx.filesListFolder({path: ''})
                //   .then(function(response) {
                //     console.log(response);
                //   })
                //   .catch(function(error) {
                //     console.log(error);
                //   });



                // workbook.xlsx.write(res)
                //     .then(function (data) {
                //         res.end();
                //         console.log('File write done........');
                //     });
                // You can then return this straight
                //res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
                //res.end();
                //return res.status(200).send(serviceExcel.createExcelDocument(result.rows));
            })

        });

        //console.log(result1);
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

//para subir mas de 150mb
//https://github.com/dropbox/dropbox-sdk-js/blob/master/examples/javascript/upload/index.html

function getValueList(rows, name) {
    //console.log("Buscando /getValueList");
    let item = {};
    rows.forEach(element => {
        if (element.name == name)
            item = element;
    });
    return item;
}

function getOrganizationMaster(rows, isMaster, organization) {
    let item = {};
    // console.log("Buscando /getOrganizationMaster");
    rows.forEach(element => {
        if (isMaster) {
            if (element.name == 'master') {
                item = element;
            }
        } else {
            if (element.name == organization) {
                item = element;
            }
        }
    });
    return item;
}




module.exports = {
    getDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    saveDocument,
    getExcelDocument
}