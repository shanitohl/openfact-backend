const excel = require('exceljs');
var moment = require('moment');

// //Here you specify the export structure
// const specification = {
//   i: { displayName: "DE LA OPERACION", headerStyle: styles.headerDark },
//   issue_date: {
//     displayName: "O DOCUMENTO", headerStyle: styles.headerDark, cellFormat: function (value, row) {     
//       let fecha = moment(new Date(value));
//       return fecha.format("DD/MM/YYYY");
//     }
//   },
//   fecha_vencimiento: { displayName: "DE LA OPERACION", headerStyle: styles.headerDark },
//   tipo_doc: { displayName: "TIPO DOC", headerStyle: styles.headerDark },
//   serie: { displayName: "SERIE", headerStyle: styles.headerDark },
//   numero: { displayName: "NUMERO", headerStyle: styles.headerDark },
//   tipo_doc_cliente: { displayName: "DE LA OPERACION", headerStyle: styles.headerDark },
//   customer_assigned_account_id: { displayName: "NUMERO DOC", headerStyle: styles.headerDark },
//   customer_registration_name: { displayName: "RAZON SOCIAL", headerStyle: styles.headerDark },
//   exportacion: { displayName: "EXPORTACION", headerStyle: styles.headerDark },
//   gravada: { displayName: "GRAVADA", headerStyle: styles.headerDark },
//   exonerada: { displayName: "EXONERADA", headerStyle: styles.headerDark },
//   inafecta: { displayName: "INAFECTA", headerStyle: styles.headerDark },
//   ISC: { displayName: "ISC", headerStyle: styles.headerDark },
//   IGV: { displayName: "IGV", headerStyle: styles.headerDark },
//   otros_tributos: { displayName: "OTROS TRIBUTOS", headerStyle: styles.headerDark },
//   importe_total: { displayName: "IMPORTE TOTAL", headerStyle: styles.headerDark },
//   tipo_cambio: { displayName: "TIPO CAMBIO", headerStyle: styles.headerDark },
//   document_currency_code: { displayName: "MONEDA", headerStyle: styles.headerDark },
//   fechaDocRel: { displayName: "FECHA", headerStyle: styles.headerDark },
//   tipoDocRel: { displayName: "TIPO DOC", headerStyle: styles.headerDark },
//   serieDocRel: { displayName: "SERIE", headerStyle: styles.headerDark },
//   numeroDocRel: { displayName: "NUMERO", headerStyle: styles.headerDark },
//   porcenjeIgv: { displayName: "IGV", headerStyle: styles.headerDark },
//   status: { displayName: "ESTADO", headerStyle: styles.headerDark },
//   codigo: { displayName: "CODIGO", headerStyle: styles.headerDark },
//   status_message: { displayName: "MENSAJE", headerStyle: styles.headerDark },
//   xml_digest_value: { displayName: "DIGIT VALUE", headerStyle: styles.headerDark }
//   // issue_date: { // <- the key should match the actual data key
//   //   displayName: 'O DOCUMENTO', // <- Here you specify the column header
//   //   headerStyle: styles.headerDark, // <- Header style
//   //   cellStyle: function(value, row) { // <- style renderer function
//   //     // if the status is 1 then color in green else color in red
//   //     // Notice how we use another cell value to style the current one
//   //     return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible 
//   //   },
//   //   width: 120 // <- width in pixels
//   // },
//   // serie: {
//   //   displayName: 'Status',
//   //   headerStyle: styles.headerDark,
//   //   // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
//   //   //   return (value == 1) ? 'Active' : 'Inactive';
//   //   // },
//   //   width: '10' // <- width in chars (when the number is passed as string)
//   // },
//   // numero: {
//   //   displayName: 'Description',
//   //   headerStyle: styles.headerDark,
//   //   cellStyle: styles.cellPink, // <- Cell style
//   //   width: 220 // <- width in pixels
//   // }
// }



// Create the excel report.
// This function will return Buffer
function createExcelDocument(rows) {

  var workbook = new excel.Workbook(); //creating workbook
  workbook.creator = 'Openfact.pe';
  workbook.lastModifiedBy = 'openfact';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.properties.date1904 = true;
  var sheet = workbook.addWorksheet('MySheet'); //creating worksheet
  sheet.columns = [
    { key: 'i', header: 'DE LA OPERACION', width: 10 },
    { key: 'issue_date', header: 'O DOCUMENTO', width: 15, type: 'date', style: { numFmt: 'dd/mm/yyyy' } },
    { key: 'echa_vencimiento', header: 'DE LA OPERACION', width: 15 },
    { key: 'tipo_doc', header: 'TIPO DOC', width: 10 },
    { key: 'serie', header: 'SERIE', width: 10 },
    { key: 'numero', header: 'NUMERO', width: 15 },
    { key: 'tipo_doc_cliente', header: 'DE LA OPERACION', width: 8 },
    { key: 'customer_assigned_account_id', header: 'NUMERO DOC', width: 15 },
    { key: 'customer_registration_name', header: 'RAZON SOCIAL', width: 32 },
    { key: 'exportacion', header: 'EXPORTACION', width: 10, type: 'decimal' },
    { key: 'gravada', header: 'GRAVADA', width: 10 },
    { key: 'exonerada', header: 'EXONERADA', width: 10, type: 'decimal' },
    { key: 'inafecta', header: 'INAFECTA', width: 10, type: 'decimal' },
    { key: 'ISC', header: 'ISC', width: 10, type: 'decimal' },
    { key: 'IGV', header: 'IGV', width: 10, type: 'decimal' },
    { key: 'otros_tributos', header: 'OTROS TRIBUTOS', width: 10, type: 'decimal' },
    { key: 'importe_total', header: 'IMPORTE TOTAL', width: 10, type: 'decimal' },
    { key: 'tipo_cambio', header: 'TIPO CAMBIO', width: 10, type: 'decimal' },
    { key: 'document_currency_code', header: 'MONEDA', width: 15 },
    { key: 'fechaDocRel', header: 'FECHA', width: 10 },
    { key: 'tipoDocRel', header: 'TIPO DOC', width: 10 },
    { key: 'serieDocRel', header: 'SERIE', width: 10 },
    { key: 'numeroDocRel', header: 'NUMERO', width: 10 },
    { key: 'porcenjeIgv', header: 'IGV', width: 10 },
    { key: 'status', header: 'ESTADO', width: 10 },
    { key: 'codigo', header: 'CODIGO', width: 10 },
    { key: 'status_message', header: 'MENSAJE', width: 32 },
    { key: 'xml_digest_value', header: 'DIGIT VALUE', width: 10 }
    // { key: 'issue_date', header: 'Name', width: 32 },
    // { key: 'dob', header: 'D.O.B.', width: 10, outlineLevel: 1, type: 'date', formulae: [new Date(2016, 0, 1)] }
  ];

  //const dataset = rows;

  // sheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
  // sheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

  //sheet.addRow().values = Object.keys(rows[0]);
  //let count = 0;
  rows.forEach(function (item) {
    var valueArray = [];
    valueArray = Object.values(item); // forming an array of values of single json in an array
    //if (count == 0) console.log(valueArray);
    sheet.addRow(valueArray); // add the array as a row in sheet}
    //count++;
  });
  sheet.getColumn(11).numFmt = '#,##0.00';
  sheet.getColumn(12).numFmt = '#,##0.00';
  sheet.getColumn(13).numFmt = '#,##0.00';
  sheet.getColumn(14).numFmt = '#,##0.00';
  sheet.getColumn(15).numFmt = '#,##0.00';
  sheet.getColumn(16).numFmt = '#,##0.00';
  sheet.getColumn(17).numFmt = '#,##0.00';  
  //sheet.getCell('K2').numFmt = '0.00';

  return workbook;

  // workbook.xlsx.writeFile('./temp.xlsx').then(function () {
  //   console.log("file is written");
  // });
  // var tempfile = require('tempfile');
  // var tempFilePath = tempfile('.xlsx');
  // console.log("tempFilePath : ", tempFilePath);
  // workbook.xlsx.writeFile(tempFilePath).then(function () {
  //   res.sendFile(tempFilePath, function (err) {
  //     console.log('---------- error downloading file: ', err);
  //   });
  //   console.log('file is written');
  // });

  // [
  //   {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
  //   {customer_name: 'HP', status_id: 0, note: 'some note'},
  //   {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
  // ]

  // Define an array of merges. 1-1 = A:1
  // The merges are independent of the data.
  // A merge will overwrite all data _not_ in the top-left cell.
  // const merges = [
  //   { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
  //   { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
  //   { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
  // ]

  // const report = excel.buildExport(
  //   [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
  //     {
  //       name: 'Reporte de ventas', // <- Specify sheet name (optional)
  //       heading: heading, // <- Raw heading array (optional)
  //       merges: merges, // <- Merge cell ranges
  //       specification: specification, // <- Report specification
  //       data: dataset // <-- Report data
  //     }
  //   ]
  // );
  // return report;
}


module.exports = {
  createExcelDocument
}

