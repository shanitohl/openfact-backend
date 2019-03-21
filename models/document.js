'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = Schema({
    issue_date:Date,
    codigoMoneda:String,
    montoPagar:Number,
    documentoCliente:String,
    nombreCliente:String,
    bajaProceso:String,
    estadoSunat:String
    // name: String,
    // picture: String,
    // price: { type: Number, default: 0 },
    // category: { type: String, emun: ["computers", "phones", "accesories"] },
    // description: String
});

module.exports = mongoose.model("document", documentSchema);