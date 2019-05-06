'use strict'

const Product = require("../models/product");
const db = require("../db/index");

const serviceExcel = require("../Services/ExcelDocument");
const querys = require("../db/queries");
const fs = require('fs');
const uuidv1 = require('uuid/v1');
var tmp = require('tmp');

var documentSharedMap = {
    "filename": "fileName",
    "sharedlink": "sharedLink",
    "datefrom": "dateFrom",
    "createdtimestamp": "createdTimestamp",
    "dateto": "dateTo"
};


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
        db.query(querys.getQuerySelectAllDocuments(organization_id, req.body), (err, result) => {
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

async function getExcelDocument(req, res) {
    console.log("/api/organizations/:organization_name/excel");
    try {
        let organization_name = req.params.organization_name;

        let organizations = await db.query(querys.getQueryFindOrganization(organization_name, "master"));
        let organization_id = getOrganizationMaster(organizations.rows, false, organization_name).id; //result1.rows[0].id;
        let organization_description = getOrganizationMaster(organizations.rows, false, organization_name).description; //result1.rows[0].id;
        let organization_id_storage = organization_id;
        let isMasterStoreage = organizations.rows[0].is_master_storage;
        if (isMasterStoreage == '1') {
            organization_id_storage = getOrganizationMaster(organizations.rows, true, organization_name).id;
        }
        console.log(organization_name + " " + organization_id);

        let organizationConfig = await db.query(querys.getQueryFindOrganizationStorageConfig(organization_id_storage));
        let accessToken = getValueList(organizationConfig.rows, "DbxAccessToken").value; //ressult2.rows[0].value;
        let clientIdentifier = getValueList(organizationConfig.rows, "DbxClientIdentifier").value; //ressult2.rows[1].value;
        let userId = getValueList(organizationConfig.rows, "DbxUserId").value; //ressult2.rows[2].value;

        let documentSales = await db.query(querys.getQueryReportVentas(organization_id, req.body.dateFrom, req.body.dateTo));
        console.log("Total documents: " + documentSales.rows.length);
        let workbook = serviceExcel.createExcelDocument(documentSales.rows, organization_name, organization_description, req.body.dateFrom + " - " + req.body.dateTo);
        //res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        //res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        let fileName = organization_name + '_' + new Date().toISOString().replace(':', '').replace(':', '').replace('.', '');
        // mkdirp(process.cwd() + '/FilesGenerate', function (err) {
        //     if (err) {
        //         console.log("Error al crear directorio..." + err);
        //         //return cb(err);                       
        //     }
        var tmpobj = tmp.dirSync();
        console.log('Folder: ', tmpobj.name);
        console.log("creando el archivo...");
        workbook.xlsx.writeFile(tmpobj.name + '/' + fileName + '.xlsx').then((buffer) => {
            console.log("file is written in " + tmpobj.name + " -- " + fileName + ".xlsx for ID:" + organization_id);

            require('isomorphic-fetch'); // or another library of choice.
            var Dropbox = require('dropbox').Dropbox;
            console.log(process.env.DBX_API_TOKEN);
            var dbx = new Dropbox({ accessToken: process.env.DBX_API_TOKEN });

            fs.readFile(tmpobj.name + '/' + fileName + '.xlsx', function(err, contents) {
                dbx.filesUpload({ path: '/ReportVentasOpenfact/' + fileName + ".xlsx", contents: contents })
                    .then(function(response) {
                        //var results = document.getElementById('results');
                        //results.appendChild(document.createTextNode('File uploaded!'));
                        //console.log(response);
                        let shared_link_metadata = dbx.sharingCreateSharedLink({ path: '/ReportVentasOpenfact/' + fileName + ".xlsx", short_url: false }).then(function(responseDb) {
                            console.log("Url document : " + responseDb.url);
                            const query = {
                                text: 'INSERT INTO organization_sales(id,organization_id,file_name,shared_url,date_from,date_to,created_timestamp) VALUES($1, $2,$3, $4,$5, $6,$7);',
                                values: [uuidv1(), organization_id, fileName + ".xlsx", responseDb.url, req.body.dateFrom, req.body.dateTo, new Date()],
                            }
                            db.query(query, (err, res) => {
                                if (err) {
                                    console.log(err.stack)
                                } else {
                                    //console.log(res)
                                    console.log("El archivo esta listo para su descarga desde la web.")
                                }
                            })

                        });

                    })
                    .catch(function(error) {
                        console.error(error);
                    });
            });
            res.status(200).send({ result: "Se genero correctamente el archivo, espere unos momentos por favor..." });
        });

        //});
    } catch (err) {
        console.log(err);
        res.status(500).send("Ocurrio un error al procesar la informacion.");
    }

}

async function getSharedDocument(req, res) {
    try {
        console.log("/api/organizations/:organization_name/sharedLinks");
        let organization_name = req.params.organization_name;

        let organizations = await db.query(querys.getQueryFindOrganization(organization_name, "master"));
        let organization_id = getOrganizationMaster(organizations.rows, false, organization_name).id;
        console.log(organization_name + " " + organization_id);

        let documentShared = await db.query(querys.getQuerySharedDocuments(organization_id));
        if (documentShared) {
            var shareDocuments = [];
            documentShared.rows.forEach(function(item) {
                shareDocuments.push({
                    "fileName": item.filename,
                    "sharedLink": item.sharedlink,
                    "dateFrom": item.datefrom,
                    "createdTimestamp": item.createdtimestamp,
                    "dateTo": item.dateto
                });
            });
            res.status(200).send(shareDocuments);
        } else {
            res.status(200).send({ mensagge: "No se encontraron resultados" });
        }
    } catch (err) {
        console.log("Error del sistema: " + err);
        res.status(500).send("Ocurrio un error al procesar la informacion de consulta.");
    }
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
    getExcelDocument,
    getSharedDocument
}