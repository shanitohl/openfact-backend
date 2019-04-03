const excel = require('node-excel-export');
var moment = require('moment');

// You can define styles as json object
const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 10,
      bold: true,
      underline: true
    }
  },
  cellText: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
    }
  },
  cellNumber: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  },
  cellDate: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  }
};

//Array of objects representing heading rows (very top)
const heading = [
  [{ value: 'a1', style: styles.headerDark }, { value: 'b1', style: styles.headerDark }, { value: 'c1', style: styles.headerDark }],
  ['a2', 'b2', 'c2'] // <-- It can be only values
];

//Here you specify the export structure
const specification = {
  i: { displayName: "DE LA OPERACION", headerStyle: styles.headerDark },
  issue_date: {
    displayName: "O DOCUMENTO", headerStyle: styles.headerDark, cellFormat: function (value, row) {     
      let fecha = moment(new Date(value));
      return fecha.format("DD/MM/YYYY");
    }
  },
  fecha_vencimiento: { displayName: "DE LA OPERACION", headerStyle: styles.headerDark },
  tipo_doc: { displayName: "TIPO DOC", headerStyle: styles.headerDark },
  serie: { displayName: "SERIE", headerStyle: styles.headerDark },
  numero: { displayName: "NUMERO", headerStyle: styles.headerDark },
  tipo_doc_cliente: { displayName: "DE LA OPERACION", headerStyle: styles.headerDark },
  customer_assigned_account_id: { displayName: "NUMERO DOC", headerStyle: styles.headerDark },
  customer_registration_name: { displayName: "RAZON SOCIAL", headerStyle: styles.headerDark },
  exportacion: { displayName: "EXPORTACION", headerStyle: styles.headerDark },
  gravada: { displayName: "GRAVADA", headerStyle: styles.headerDark },
  exonerada: { displayName: "EXONERADA", headerStyle: styles.headerDark },
  inafecta: { displayName: "INAFECTA", headerStyle: styles.headerDark },
  ISC: { displayName: "ISC", headerStyle: styles.headerDark },
  IGV: { displayName: "IGV", headerStyle: styles.headerDark },
  otros_tributos: { displayName: "OTROS TRIBUTOS", headerStyle: styles.headerDark },
  importe_total: { displayName: "IMPORTE TOTAL", headerStyle: styles.headerDark },
  tipo_cambio: { displayName: "TIPO CAMBIO", headerStyle: styles.headerDark },
  document_currency_code: { displayName: "MONEDA", headerStyle: styles.headerDark },
  fechaDocRel: { displayName: "FECHA", headerStyle: styles.headerDark },
  tipoDocRel: { displayName: "TIPO DOC", headerStyle: styles.headerDark },
  serieDocRel: { displayName: "SERIE", headerStyle: styles.headerDark },
  numeroDocRel: { displayName: "NUMERO", headerStyle: styles.headerDark },
  porcenjeIgv: { displayName: "IGV", headerStyle: styles.headerDark },
  status: { displayName: "ESTADO", headerStyle: styles.headerDark },
  codigo: { displayName: "CODIGO", headerStyle: styles.headerDark },
  status_message: { displayName: "MENSAJE", headerStyle: styles.headerDark },
  xml_digest_value: { displayName: "DIGIT VALUE", headerStyle: styles.headerDark }
  // issue_date: { // <- the key should match the actual data key
  //   displayName: 'O DOCUMENTO', // <- Here you specify the column header
  //   headerStyle: styles.headerDark, // <- Header style
  //   cellStyle: function(value, row) { // <- style renderer function
  //     // if the status is 1 then color in green else color in red
  //     // Notice how we use another cell value to style the current one
  //     return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible 
  //   },
  //   width: 120 // <- width in pixels
  // },
  // serie: {
  //   displayName: 'Status',
  //   headerStyle: styles.headerDark,
  //   // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
  //   //   return (value == 1) ? 'Active' : 'Inactive';
  //   // },
  //   width: '10' // <- width in chars (when the number is passed as string)
  // },
  // numero: {
  //   displayName: 'Description',
  //   headerStyle: styles.headerDark,
  //   cellStyle: styles.cellPink, // <- Cell style
  //   width: 220 // <- width in pixels
  // }
}



// Create the excel report.
// This function will return Buffer
function createExcelDocument(rows) {

  // The data set should have the following shape (Array of Objects)
  // The order of the keys is irrelevant, it is also irrelevant if the
  // dataset contains more fields as the report is build based on the
  // specification provided above. But you should have all the fields
  // that are listed in the report specification
  //console.log(rows);
  const dataset = rows;
  // [
  //   {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
  //   {customer_name: 'HP', status_id: 0, note: 'some note'},
  //   {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
  // ]

  // Define an array of merges. 1-1 = A:1
  // The merges are independent of the data.
  // A merge will overwrite all data _not_ in the top-left cell.
  const merges = [
    { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
    { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
    { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
  ]

  const report = excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
        name: 'Reporte de ventas', // <- Specify sheet name (optional)
        heading: heading, // <- Raw heading array (optional)
        merges: merges, // <- Merge cell ranges
        specification: specification, // <- Report specification
        data: dataset // <-- Report data
      }
    ]
  );
  return report;
}


module.exports = {
  createExcelDocument
}

