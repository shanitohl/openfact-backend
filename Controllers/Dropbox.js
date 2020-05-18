'use strict'
var fetch = require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
//var dbx = new Dropbox({ accessToken: '-ANflCgn5uQAAAAAAAABjUytIByhWQ1SVYqgHVtXdfAymoQyxAgbp_kTywXvIEMX', fetch: fetch });
var dbx = new Dropbox({ accessToken: 'nzOJn6aT5eAAAAAAAAADnnqpSGd4Iw7ivl8qEG7SvHwPwQObUfb_-VzBQo3etmA3', fetch: fetch });
const db = require("../db/index");
const db2 = require("../db/index2");// conect db 2 (destino)
const querys = require("../db/queries");
var fs = require('fs');

function allFilesDropbox(req, res) {
    console.log("servicio Dropbox");
    dbx.filesListFolder({ path: '' })
        .then(function (response) {
            console.log('repuesta dropbox ', response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

var cantDocXMLAsubir = 0;
var cantDocXMLSubido = 0;
var cantDocCDRAsubir = 0;
var cantDocCDRSubido = 0;
//upload all documents 
async function AllDocumentsOrganizationbyId(req, res) {
    let organization_name = req.params.organization_name;
    console.log("organization name ", organization_name);
    let resp = await db.query(querys.getOrganizationByName(organization_name));
    //console.log("data ",resp);
    let organization_id = resp.rows[0].id;
    console.log("organization Id ", organization_id);
    let cant = 1;
    let limit = cant;
    let aux = cant;
    let offset = 0;
    // upload
    // let respTotal = await db.query(querys.getQueryCountDocumentsOrganizationId(organization_id));
    // let total = respTotal.rows[0].total;
    // console.log("Total docuemnts :" + total);

    //// not upload

    let respTotal1 = await db.query(querys.getQueryCountDocumentsIsNotUpload(organization_id));
    let total = respTotal1.rows[0].total;
    console.log("Total docuemnts not upload :" + total);
    try {

/// not upload
        var r = setInterval(function () {
                
            callQueryNot(organization_name,organization_id, limit, offset);
            console.log("total subido ", aux);
            aux = aux + cant;
            //offset = offset + cant;
            if(aux > total){
                console.log("termino upload");
            clearInterval(r)
            
            }
        }, 5000);

        
/////-------------------------
//// upload 
            // var r = setInterval(function () {

            //     callQuery(organization_name,organization_id, limit, offset);
               
            //     aux = aux + cant;
            //     //offset = offset + cant;
            //     if(aux > total){
            //         console.log("termino upload");
            //     clearInterval(r)
                
            //     }
            // }, 15000);

/////-------------------------
        // }

        // do {
        //     // console.log("off "+offset );
        //     // console.log("limit  "+limit );
        //     // console.log("aux  "+aux );

        //         db.query(querys.getQueryAllDocumentsOrganizationId(organization_id, limit, offset), (err, respuest) => {

        //             console.log("response " ,respuest.rowCount );
        //             //   setInterval( function(){
        //             //       for(let i = 0; i<total; i++){
        //             //         console.log("value ", i);
        //             //    }}, 2000)

        //             // if (respuest) {
        //             //     // setInterval( function(){
        //             //     //    console.log("hola mundo ");
        //             //     // }
        //             //     //     , 5000);
        //             //     //let allData = respuest.rows;
        //             //     // console.log("total data ",allData.length);
        //             //     respuest.rows.forEach( d => {

        //             //         if (d.xml_file_id != null) {
        //             //             console.log("xml_id ", d.xml_file_id);
        //             //             cantDocXMLAsubir++;
        //             //             //uploadxml(d, organization_name);
        //             //             console.log("cantidad xml a subir " + cantDocXMLAsubir);

        //             //         }
        //             //         if (d.cdr_file_id) {
        //             //             cantDocCDRAsubir++;
        //             //             //uploadCdr(d, organization_name);
        //             //             console.log("cantidad cdr a subir " + cantDocCDRAsubir);
        //             //         }
        //             //     })

        //             // }
        //             if (err) { console.log("error de upload all ", err) }
        //             //    res.status(200).send({ data:respuest })
        //         });

        //         offset = offset + cant;
        //         aux = aux + cant;
        //         console.log("aux interval ", aux);


        // } while (aux < total)
        //} while (false)

    } catch (error) {
        console.log("error del try " + error);
    }
}

//all document not upload
function callQueryNot(organization_name, organization_id, limit, offset){
    console.log("limit ", limit);
    console.log("offset ", offset);
db.query(querys.getQueryAllDocumentsIsNotUpload(organization_id, limit, offset) , (err, respuest) =>{

    if (respuest) {
        console.log("data all  "+respuest.rowCount);
        respuest.rows.forEach(d => {

            // console.log("data not ", d);

            if (respuest) {
                respuest.rows.forEach(d => {
    
                    if (d.xml_file_id != null) {
                        console.log("xml_id ", d.xml_file_id);
                        cantDocXMLAsubir++;
                        //uploadxml(d, organization_name);
                        console.log("cantidad xml a subir " + cantDocXMLAsubir);
    
                    }
                    if (d.cdr_file_id) {
                        console.log("cdr id ", d.cdr_file_id);
                        cantDocCDRAsubir++;
                        //uploadCdr(d, organization_name);
                        console.log("cantidad cdr a subir " + cantDocCDRAsubir);
                    }
                })
    
            }
            if (err) { console.log("error de upload all ", err) }
            
        })

    }
    if (err) { console.log("error de upload not upload ", err) }
})
}



// alll documents upload 
function callQuery(organization_name, organization_id, limit, offset) {
    console.log("limit ", limit);
    console.log("offset ", offset);
    db.query(querys.getQueryAllDocumentsOrganizationId(organization_id, limit, offset), (err, respuest) => {

        if (respuest) {
            respuest.rows.forEach(d => {

                if (d.xml_file_id != null) {
                    console.log("xml_id ", d.xml_file_id);
                    cantDocXMLAsubir++;
                    uploadxml(d, organization_name);
                    console.log("cantidad xml a subir " + cantDocXMLAsubir);

                }
                if (d.cdr_file_id) {
                    cantDocCDRAsubir++;
                    uploadCdr(d, organization_name);
                    console.log("cantidad cdr a subir " + cantDocCDRAsubir);
                }
            })

        }
        if (err) { console.log("error de upload all ", err) }

    });

}

// all documents for date (download files xml and cdr)
async function AllDocumentsOrganizationByDate(req, res) {
    let organization_name = req.params.organization_name;
    let resp = await db.query(querys.getOrganizationByName(organization_name));
    let organization_id = resp.rows[0].id;
    let cant = 100;
    let limit = cant;
    let aux = cant;
    let offset = 0;
    let date = "%2019-05%"
    let respTotal = await db.query(querys.getQueryCountAllDocumentsByOrganizationByDate(organization_id, date));
    let total = respTotal.rows[0].total;
    try {
        do {

            db.query(querys.getQueryAllDocumentsByOrganizationByDate(organization_id, date, limit, offset), (err, respuest) => {
                if (respuest) {
                    respuest.rows.forEach(d => {
                        if (d.xml_file_id != null) {
                            downloadXml(d, organization_name);
                        }
                        if (d.cdr_file_id) {
                            downloadCdr(d, organization_name);
                        }
                    })
                }
                if (err) { console.log("error de prueba " + JSON.stringify(err)) }
                //    res.status(200).send({ data:respuest })
            });
            offset = offset + cant;
            aux = aux + cant;
        } while (aux < total)

    } catch (error) {
        console.log("error del try " + error);
    }

}
// download all Docmuents
async function downloadAllDocumentsOrganizationbyId(req, res) {
    let organization_name = req.params.organization_name;
    let resp = await db.query(querys.getOrganizationByName(organization_name));
    let organization_id = resp.rows[0].id;
    let cant = 10;
    let limit = cant;
    let aux = cant;
    let offset = 0;
    let respTotal = await db.query(querys.getQueryCountDocumentsOrganizationId(organization_id));
    let total = respTotal.rows[0].total;
    let tD = await db.query(querys.getQueryTotalFilesByOrganization(organization_id));
    let totalDocuments = tD.rows[0].total;
    console.log("total de documentos a importar a Dropbox " + totalDocuments);
    try {
        do {
            setTimeout(db.query(querys.getQueryAllDocumentsOrganizationId(organization_id, limit, offset), (err, respuest) => {
                if (respuest) {
                    console.log("json total " + JSON.stringify(respuest.rowCount));
                    // console.log(JSON.stringify(respuest));
                    respuest.rows.forEach(d => {
                        if (d.xml_file_id != null) {
                            downloadXml(d, organization_name);
                        }
                        if (d.cdr_file_id) {
                            downloadCdr(d, organization_name);
                        }
                    })
                }
                console.log("json total " + JSON.stringify(respuest.rowCount));
                if (err) { console.log("error de prueba " + JSON.stringify(err)) }
                //    res.status(200).send({ data:respuest })
            }), 36000);

            offset = offset + cant;
            aux = aux + cant;
        } while (liauxmit < total)

    } catch (error) {
        console.log("error del try " + error);
    }
}

// const pathDropbox = "https://www.dropbox.com/home";
const pathDropbox = "https://www.dropbox.com/home/aplicaciones/Openfact-files";
async function uploadxml(d, organization_name) {
    // console.log("id inicial " + d.xml_file_id);
    let data = await db.query(querys.getQueryFileById(d.xml_file_id));
    let file = data.rows[0].lo_get.toString('utf8');
    let res = await db.query(querys.getQueryFileNameById(d.xml_file_id));
    let name = res.rows[0].file_name;
    let organization_name1 = '20494918910';
    //subida a dropbox
    //===============================================
    // await dbx.filesUpload({ path: '/aplicaciones/Openfact-files/' + organization_name + '/' + d.document_type +'/' + name , contents: [file] , autorename: true})
    // await dbx.filesUpload({ path: '/' + organization_name + '/' + d.document_type + '/' + name, contents: [file], autorename: true })
    await dbx.filesUpload({ path: '/' + organization_name1 + '/' + d.document_type + '/' + name, contents: [file], autorename: true })
        .then(function (response) {
            var url = pathDropbox + response.path_display;
            console.log("actualizacion por la segunda connection");
            db2.query(querys.updateFile(url, response.content_hash, d.xml_file_id), (err, result) => {
                if (result) {
                    db2.query(querys.updateDocument(d.xml_file_id), (err, result) => {
                        if (result) {
                            console.log("update Document is_file_db_storage success!!");
                        }
                        if (err) {
                            console.log("err update document " + err);
                        }
                    });
                    console.log('file upload xml id ', d.xml_file_id);
                    console.log('file upload xml name ', d.document_id);
                    cantDocXMLSubido++;
                    console.log("success update!! ");
                    console.log("cantidad subidad xml  " + cantDocXMLSubido);
                }

                if (err) {
                    console.log("err update  xml" + err);
                }
            });

            //actualizacion primera connection 
            console.log("actualizacion por la primera connection");
            db.query(querys.updateFile(url, response.content_hash, d.xml_file_id), (err, result) => {
                if (result) {
                    db.query(querys.updateDocument(d.xml_file_id), (err, result) => {
                        if (result) {
                            console.log("update Document is_file_db_storage success!!");
                        }
                        if (err) {
                            console.log("err update document " + err);
                        }
                    });
                    console.log('file upload xml id ', d.xml_file_id);
                    console.log('file upload xml name ', d.document_id);
                    cantDocXMLSubido++;
                    console.log("success update!! ");
                    console.log("cantidad subidad xml  " + cantDocXMLSubido);
                }

                if (err) {
                    console.log("err update  xml" + err);
                }
            });

        })
        .catch(function (error) {
            uploadxml(d, organization_name);
            console.error("catch error upload xml " + error.response.status);
        });
}
async function uploadCdr(d, organization_name) {
    // console.log("cdr id inicial "+d.cdr_file_id);
    let data = await db.query(querys.getQueryFileById(d.cdr_file_id));
    let file = data.rows[0].lo_get;
    let res = await db.query(querys.getQueryFileNameById(d.cdr_file_id));
    let name = res.rows[0].file_name;
    let organization_name1 = '20494918910'
    //subida a dropbox
    //===============================================
    // await dbx.filesUpload({ path: '/aplicaciones/Openfact-files/' + organization_name + '/' + d.document_type +'/' + name , contents: file , autorename: true})
    await dbx.filesUpload({ path: '/' + organization_name1 + '/' + d.document_type + '/' + name, contents: file, autorename: true })
        .then(function (response) {
            var url = pathDropbox + response.path_display;
            console.log("actualizacion por la segunda connection");
            db2.query(querys.updateFile(url, response.content_hash, d.cdr_file_id), (err, result) => {
                if (result) {
                    console.log('file upload cdr id ', d.cdr_file_id);
                    console.log('file upload cdr name ', d.document_id);
                    cantDocCDRSubido++;
                    console.log("success update!! ");
                    console.log("cantidad subida cdr " + cantDocCDRSubido);
                }

                if (err) {
                    console.log("err update cdr" + err);
                }
            });

            //primera connection 
            console.log("actualizacion por la segunda connection");
            db2.query(querys.updateFile(url, response.content_hash, d.cdr_file_id), (err, result) => {
                if (result) {
                    console.log('file upload cdr id ', d.cdr_file_id);
                    console.log('file upload cdr name ', d.document_id);
                    cantDocCDRSubido++;
                    console.log("success update!! ");
                    console.log("cantidad subida cdr " + cantDocCDRSubido);
                }

                if (err) {
                    console.log("err update cdr" + err);
                }
            });
        })
        .catch(function (error) {
            uploadCdr(d, organization_name);
            console.error("catch error  upload cdr " + error.response.status);
        });
}

async function downloadXml(d, organization_name) {
    console.log("document json ", d);
    let data = await db.query(querys.getQueryFileById(d.xml_file_id));
    let file = data.rows[0].lo_get.toString('utf8');
    let res = await db.query(querys.getQueryFileNameById(d.xml_file_id));
    let name = res.rows[0].file_name;

    //descarga local xml
    var dir = 'C:/Users/narven/Desktop/data/' + organization_name + '/' + d.document_type + '/' + d.document_id + '/';
    fs.mkdirSync(dir, { recursive: true });
    await fs.writeFile(dir + name, file, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("File saved successfully!");
    });

}

async function downloadCdr(d, organization_name) {

    let data = await db.query(querys.getQueryFileById(d.cdr_file_id));
    let file = data.rows[0].lo_get;
    let res = await db.query(querys.getQueryFileNameById(d.cdr_file_id));
    let name = res.rows[0].file_name;

    //descarga local cdr
    //=========================================
    var dir = 'C:/Users/narven/Desktop/data/' + organization_name + '/' + d.document_type + '/' + d.document_id + '/';
    fs.mkdirSync(dir, { recursive: true });
    await fs.writeFile(dir + 'cdr-' + name, file, function (err) {
        if (err) {
            return console.log("error de write file" + err);
        }
        console.log("File saved successfully!");
    })

}

module.exports = {
    allFilesDropbox,
    AllDocumentsOrganizationbyId,
    AllDocumentsOrganizationByDate,
    downloadAllDocumentsOrganizationbyId
}
