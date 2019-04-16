'use strict'

function getQuerySelectAllDocuments(organization_id, pageSize, page) {
  let query = `select d.id,d.document_id,d.issue_date,d.document_currency_code,a.value total,d.customer_assigned_account_id,d.customer_registration_name,d.baja_en_proceso,d.status 
  from document d inner join document_attribute a on d.id = a.document_id and a.name= 'totalOperacionesGravadas' 
  where organization_id = '` + organization_id + `' LIMIT ` + pageSize + ` OFFSET ` + page + `;`
  return query;
}

function getQueryCountDocumentsByOrganization(organization_id) {
  let query = "select count(*) from document where organization_id = '" + organization_id + "';";
  return query;
}

function getQueryReportVentas(organization_id, dateFrom, dateTo) {
  console.log(dateFrom + " -- " + dateTo);
  let query = `select row_number() OVER (ORDER BY doc.id) AS i,
                    doc.issue_date, '' as fecha_vencimiento,
                    d.value  as tipo_doc,
                    split_part(doc.document_id, '-', 1) as serie,
                    split_part(doc.document_id, '-', 2) as numero,
                    tipo_doc_client.value               as tipo_doc_cliente,
                    doc.customer_assigned_account_id,
                    doc.customer_registration_name,
                    ''  as exportacion,
                    a.value as gravada,
                    0                                   as exonerada,
                    0                                   as inafecta,
                    0                                   as ValorIsc,
                    b.value                             as valorIgv,
                    0                                   as otros_tributos,
                    c.value                             as importe_total,
                    1                                   as tipo_cambio,
                    doc.document_currency_code, 
                    '-' as fechaDocRel,
                    '-' as tipoDocRel,
                    '-' as serieDocRel, 
                    '-' as numeroDocRel,
                    18 as IGV, 
                    doc.status,
                    '' codigo,
                    doc.status_message,
                    doc.xml_digest_value,
                    doc.document_type
              from document doc
                left join document_attribute a on doc.id = a.document_id and a.name = 'totalOperacionesGravadas'
                left join document_attribute b on doc.id = b.document_id and b.name = 'totalIgv'
                left join document_attribute c on doc.id = c.document_id and c.name = 'legalMonetaryTotalPayableAmount'
                left join document_attribute tipo_doc_client on doc.id = tipo_doc_client.document_id and tipo_doc_client.name = 'customerAdditionalAccountID'
                left join document_attribute d on doc.id = d.document_id and d.name = 'invoiceTypeCode'
              where doc.organization_id =  '`+ organization_id + `' and  doc.document_type in ('INVOICE','CREDIT_NOTE','DEBIT_NOTE')
              and doc.issue_date BETWEEN to_date('`+ dateFrom + `','YYYY-MM-DD') AND to_date('` + dateTo + `','YYYY-MM-DD') order by doc.issue_date desc;`;
  return query;
}

//doc.organization_id =  '`+ organization_id + `' and 

function getQueryFindOrganization(organization_name, master) {
  let query = "select id,is_master_storage,name,description from organization where name in ('" + organization_name + "','" + master + "');";
  return query;
}
function getQuerySharedDocuments(organization_id) {
  let query = `select file_name as fileName,
                      shared_url as sharedLink,
                      date_from as dateFrom,
                      created_timestamp as createdTimestamp,
                      date_to as dateTo
                from organization_sales where organization_id = '` + organization_id + `'
                order by created_timestamp desc;`;  
  return query;
}

function getQueryFindOrganizationStorageConfig(organization_id) {
  let query = "select organization_id,value,name from organization_storage_config where organization_id = '" + organization_id + "';";
  return query;
}


module.exports = {
  getQuerySelectAllDocuments,
  getQueryCountDocumentsByOrganization,
  getQueryReportVentas,
  getQueryFindOrganization,
  getQueryFindOrganizationStorageConfig,
  getQuerySharedDocuments
}