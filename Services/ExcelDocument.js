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
function createExcelDocument(rows, ruc, razonSocial, periodo) {

    var workbook = new excel.Workbook(); //creating workbook
    workbook.creator = 'Openfact.pe';
    workbook.lastModifiedBy = 'openfact';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.properties.date1904 = true;
    var sheet = workbook.addWorksheet('MySheet'); //creating worksheet

    sheet.mergeCells('A1', 'D1');
    sheet.getCell('A1').value = 'Formato 14.1- Registro de Ventas e Ingresos';
    sheet.getRow(1).font = { size: 8, bold: true };
    sheet.addRow(['Periodo:'])
    sheet.mergeCells('B2', 'E2');
    sheet.getCell('B2').value = periodo;
    sheet.addRow(['Ruc:', ruc]);
    sheet.addRow(['Razon Social:', razonSocial]);
    sheet.addRow(['Expresado en:', 'Soles']);
    sheet.getRow(2).font = { size: 8, bold: true };
    sheet.getRow(3).font = { size: 8, bold: true };
    sheet.getRow(4).font = { size: 8, bold: true };
    sheet.getRow(5).font = { size: 8, bold: true };

    sheet.addRow(['']);
    sheet.addRow(['NUMERO', 'FECHA DE', 'FECHA', '', '', '', '', '', '', 'VALOR', 'BASE', '', '', '', '', '', '', '', '']);
    sheet.addRow(['CORRELATIVO', ' EMISION DEL', 'DE', ' ', '', '', '', '', '', 'FACTURA', 'IMPONIBLE', '', '', '', '', '', '', 'TIPO', '']);
    sheet.addRow(['DEL REGISTRO O', 'COMPROBANTE', 'VMTO', '', '', '', '', '', 'APELLIDOS Y NOMBRES', 'DE LA', 'DE LA', '', '', 'ISC', 'IGV Y/O IPM', 'OTROS', 'IMPORTE', 'DE', '', '']);
    sheet.addRow(['CODIGO UNICO', 'DE PAGO', 'Y/O PAG', 'TIPO', 'SERIE O NRO', 'NUMERO', 'TIPO', 'NUMERO', 'O RAZON SOCIAL', 'EXPORTACION', 'OPERACION', 'EXONERADO', 'INAFECTADO', '', '',
        'TRIBUTOS', 'TOTAL', 'CAMBIO', 'MONEDA', 'FECHA', 'TIPO', 'SERIE', 'NUMERO', 'PORC.IGV', 'ESTADO', 'CODIGO', 'MENSAJE', 'OBSERVACIÓN'
    ]);
    sheet.addRow(['DE LA OPERACION', 'O DOCUMENTO', '', '', 'MAQ. REGIST.', '', '', '', '', '', 'GRAVADA', '']);
    sheet.getRow(7).font = { size: 8, bold: true };
    sheet.getCell('A7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('B7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('C7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('D7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('G7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('J7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('K7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('L7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('N7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('O7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('P7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Q7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('R7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('S7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('T7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('X7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Y7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Z7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AA7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AB7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AC7').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getRow(8).font = { size: 8, bold: true };
    sheet.getCell('A8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('B8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('C8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('D8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('G8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('J8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('K8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('L8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('N8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('O8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('P8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Q8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('R8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('S8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('T8').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('X8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Y8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Z8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AA8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AB8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AC8').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getRow(9).font = { size: 8, bold: true };
    sheet.getCell('A9').border = { left: { style: 'thin' }, };
    sheet.getCell('B9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('C9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('D9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('E9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('F9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('G9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('I9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'none' }, right: { style: 'thin' } };
    sheet.getCell('J9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('K9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('L9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('M9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('N9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('O9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('P9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Q9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('R9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('S9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('T9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('U9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('V9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('W9').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('X9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Y9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Z9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AA9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AB9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AC9').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getRow(10).font = { size: 8, bold: true };
    sheet.getCell('A10').border = { left: { style: 'thin' }, bottom: { style: 'none' }, right: { style: 'thin' } };
    sheet.getCell('B10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('C10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('D10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('E10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('F10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('G10').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('H10').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('I10').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('J10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('K10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('L10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('M10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('N10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('O10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('P10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Q10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('R10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('S10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('T10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('U10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('V10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('W10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('X10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Y10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Z10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AA10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AB10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AC10').border = { left: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getRow(11).font = { size: 8, bold: true };
    sheet.getCell('A11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('B11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('C11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('D11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('E11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('F11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('G11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('H11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('I11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('J11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('K11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('L11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('M11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('N11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('O11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('P11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Q11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('R11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('S11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('T11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('U11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('V11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('W11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('X11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Y11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('Z11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AA11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AB11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.getCell('AC11').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    sheet.mergeCells('D7', 'F7');
    sheet.getCell('D7').value = 'COMPROBANTE DE PAGO';
    sheet.mergeCells('D8', 'F8');
    sheet.getCell('D8').value = 'O DOCUMENTO';
    sheet.mergeCells('G7', 'I7');
    sheet.getCell('G7').value = 'INFORME DEL CLIENTE';
    sheet.mergeCells('G8', 'I8');
    sheet.getCell('G8').value = '';
    sheet.mergeCells('G9', 'H9');
    sheet.getCell('G8').value = 'DOC. IDENTIDAD';

    sheet.mergeCells('L7', 'M7');
    sheet.getCell('L7').value = 'INPORTE TOTAL DE LA';
    sheet.mergeCells('L8', 'M8');
    sheet.getCell('L8').value = 'OPERACION';

    sheet.mergeCells('T7', 'W7');
    sheet.getCell('T7').value = 'REFEENCIA DEL COMPROBANTE DE PAGO';
    sheet.mergeCells('T8', 'W8');
    sheet.getCell('T8').value = 'O DOCUMENTO ORIGINAL QUE SEA MODIFICADA';
    //let offset = 7;;
    var contador = 0;
    var contadorValorIgv = 0;
    var contadorImporte_total = 0;
    var contadorExonerado = 0;
    var contadorInafecta = 0;
    var contadorISC = 0;
    var contadorTributo = 0;

    sheet.getRow(11, 0, new Array());
    rows.forEach(function(item) {
        var valueArray = [];
        // valueArray = Object.values(item); // forming an array of values of single json in an array
        // sheet.addRow(valueArray); // agregar la matriz como una fila en la hoja
        sheet.addRow([item.i, item.issue_date, , item.tipo_doc, item.serie, item.numero,
            item.tipo_doc_cliente, item.customer_assigned_account_id, item.customer_registration_name,
            item.exportaciom, Number(item.gravada), Number(item.exonerada), Number(item.inafecta),
            Number(item.valorisc), Number(item.valorigv), Number(item.otros_tributos), Number(item.importe_total),
            item.tipo_cambio, item.document_currency_code, item.fechaDocRel, item.tipoDocRel, item.serieDocRel, item.numeroDocRel,
            item.IGV, item.status, item.codigo, item.status_message, item.xml_digest_value, item.document_type
        ]);
        contador = contador + Number(item.gravada);
        contadorValorIgv = contadorValorIgv + Number(item.valorigv);
        contadorImporte_total = contadorImporte_total + Number(item.importe_total);
        contadorExonerado = contadorExonerado + Number(item.exonerada);
        contadorInafecta = contadorInafecta + Number(item.inafecta);
        contadorISC = contadorISC + Number(item.valorisc);
        contadorTributo = contadorTributo + Number(item.otros_tributos);
    });

    sheet.getColumn(11).numFmt = '#,##0.00';
    sheet.getColumn(12).numFmt = '#,##0.00';
    sheet.getColumn(13).numFmt = '#,##0.00';
    sheet.getColumn(14).numFmt = '#,##0.00';
    sheet.getColumn(15).numFmt = '#,##0.00';
    sheet.getColumn(16).numFmt = '#,##0.00';
    sheet.getColumn(17).numFmt = '#,##0.00';
    sheet.getColumn(1).width = 15;
    sheet.getColumn(1).alignment = { vertical: 'bottom', horizontal: 'right' };
    sheet.getColumn(2).width = 13;
    sheet.getColumn(2).numFmt = 'dd/mm/yyyy';
    sheet.getColumn(3).width = 15;
    sheet.getColumn(4).width = 10;
    sheet.getColumn(4).alignment = { vertical: 'bottom', horizontal: 'right' };
    sheet.getColumn(5).width = 10;
    sheet.getColumn(6).width = 10;
    sheet.getColumn(6).alignment = { vertical: 'bottom', horizontal: 'right' };
    sheet.getColumn(7).width = 8;
    sheet.getColumn(8).width = 15;
    sheet.getColumn(8).alignment = { vertical: 'bottom', horizontal: 'right' };
    sheet.getColumn(9).width = 22;
    sheet.getColumn(10).width = 10;
    sheet.getColumn(11).width = 10;
    sheet.getColumn(11).alignment = { vertical: 'bottom', horizontal: 'right' };
    sheet.getColumn(12).width = 10;
    sheet.getColumn(13).width = 10;
    sheet.getColumn(14).width = 10;
    sheet.getColumn(15).width = 10;
    sheet.getColumn(15).alignment = { vertical: 'bottom', horizontal: 'right' };
    sheet.getColumn(16).width = 10;
    sheet.getColumn(17).width = 10;
    sheet.getColumn(17).alignment = { vertical: 'bottom', horizontal: 'right' };
    sheet.getColumn(18).width = 10;
    sheet.getColumn(19).width = 10;
    sheet.getColumn(20).width = 10;
    sheet.getColumn(21).width = 10;
    sheet.getColumn(22).width = 10;
    sheet.getColumn(23).width = 10;
    sheet.getColumn(24).width = 10;
    sheet.getColumn(25).width = 10;
    sheet.getColumn(26).width = 10;
    sheet.getColumn(27).width = 10;
    sheet.getColumn(28).width = 20;
    sheet.getColumn(29).width = 10;

    sheet.getCell('A1').alignment = { vertical: 'top', horizontal: 'left' };
    sheet.getCell('A2').alignment = { vertical: 'top', horizontal: 'left' };
    sheet.getCell('B2').alignment = { vertical: 'top', horizontal: 'left' };
    sheet.getCell('A3').alignment = { vertical: 'top', horizontal: 'left' };
    sheet.getCell('A4').alignment = { vertical: 'top', horizontal: 'left' };
    sheet.getCell('A5').alignment = { vertical: 'top', horizontal: 'left' };
    sheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('B7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('C7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('D7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('G7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('J7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('K7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('L7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('S7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('T7').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('B8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('C8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('D8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('G8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('J8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('K8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('L8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('N8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('O8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('P8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('Q8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('R8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('S8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('T8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('X8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('Y8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('Z8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('AA8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('AB8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('AC8').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('A9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('B9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('C9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('D9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('E9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('F9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('G9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('I9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('J9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('K9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('L9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('N9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('O9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('P9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('Q9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('R9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('T9').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('A10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('B10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('C10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('D10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('G10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('H10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('I10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('J10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('P10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('Q10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('R10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('S10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('T10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('U10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('V10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('W10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('Y10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('Z10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('AA10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('AB10').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('A11').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('B11').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('E11').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('K11').alignment = { vertical: 'middle', horizontal: 'center' };

    let indexRowTotal = 11 + rows.length + 1;
    sheet.getCell('J' + indexRowTotal).value = 'TOTAL: ';
    sheet.getCell('K' + indexRowTotal).value = contador;
    sheet.getCell('O' + indexRowTotal).value = contadorValorIgv;
    sheet.getCell('Q' + indexRowTotal).value = contadorImporte_total;
    sheet.getCell('L' + indexRowTotal).value = contadorExonerado;
    sheet.getCell('M' + indexRowTotal).value = contadorInafecta;
    sheet.getCell('N' + indexRowTotal).value = contadorISC;
    sheet.getCell('P' + indexRowTotal).value = contadorTributo;
    return workbook;
}
module.exports = {
    createExcelDocument
}