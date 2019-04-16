'use strict'

const mongoose = require("mongoose");


const app = require("./app");
const config = require("./config");


// pg.connect('postgres://postgres:123456@localhost:54321/openfact');



app.listen(config.port, () => {
    console.log("CORS-enabled web server listening on port:" + config.port);
})


// mongoose.connect(config.db, (err, res) => {
//     if (err) throw err;
//     console.log("Conexion a la base de datos establecida");
//     app.listen(config.port, () => {
//         console.log("API REST corriendo en http://localhost:" + config.port);
//     })
// })


