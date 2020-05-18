'use strict'

function getQuerySelectAllDocuments(organization_id, filter) {
    let querySelect = `select d.id,d.document_id,d.issue_date,d.document_currency_code,a.value total,d.customer_assigned_account_id,d.customer_registration_name,d.baja_en_proceso,d.status 
                        from document d 
                        inner join document_attribute a on d.id = a.document_id and a.name= 'totalOperacionesGravadas' 
                        inner join document_required_action c on d.id = c.document_id`
    let queryWhere = ` where organization_id = '` + organization_id + "'";;

    filter.filters.forEach(element => {
        if (element.name == "createdTimestamp")
            queryWhere = queryWhere + " and createdTimestamp > '" + element.value + "'";
        if (element.name == "document_type")
            queryWhere = queryWhere + " and document_type='" + element.value + "'";
        if (element.name == "status")
            queryWhere = queryWhere + " and status='" + element.value + "'";
        if (element.name == "required_action")
            queryWhere = queryWhere + " and required_action='" + element.value + "'";
    });
    if (filter.filterText != "")
        queryWhere = queryWhere + "and (a.value like '%" + filter.filterText + "%'  or d.customer_assigned_account_id like '%" + filter.filterText + "%' or d.customer_registration_name like '%" + filter.filterText + "%')"
    if (filter.paging != null)
        queryWhere = queryWhere + "LIMIT  " + filter.paging.pageSize + " OFFSET  " + filter.paging.page + " ;"

    //console.log(querySelect + " " + queryWhere);
    return querySelect + " " + queryWhere;
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
                    a.value                             as gravada,                 
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
                left join document_attribute tipo_doc_client on doc.id = tipo_doc_client.document_id and tipo_doc_client.name = 'customerPartyAdditionalAccountID'
                left join document_attribute d on doc.id = d.document_id and d.name = 'invoiceTypeCode'
              where doc.organization_id =  '` + organization_id + `' and  doc.document_type in ('INVOICE','CREDIT_NOTE','DEBIT_NOTE')
              and doc.issue_date BETWEEN to_date('` + dateFrom + `','YYYY-MM-DD') AND to_date('` + dateTo + `','YYYY-MM-DD') order by doc.issue_date desc;`;
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

function getOrganizationByName(organizationName){
let query ="select o.id from organization o  where o.name = '"+organizationName+"';"
return query;
}

function getQueryAllDocumentsOrganizationId(organization_id, limit, offset){
    //console.log("ooffset :::: "+offset);
    let query = "select * from document c where c.organization_id = '"+organization_id+ "'and  order by c.created_timestamp limit '"+limit+"' offset '"+offset+"'"; 
    return query;
}

function getQueryCountDocumentsOrganizationId(organization_id){
    let query = "select count(*) total from document c where c.organization_id = '"+organization_id+ "'" ;
    return query;
}

function getQueryFileById(file_id){
     let query ="select lo_get(of.file) from organization_file of where of.id = '" + file_id + "';"
    return query;
}

function getQueryFileNameById(file_id){
     let query ="select of.file_name  from organization_file of where of.id = '"+ file_id + "';"
    return query;
}

function updateFile(url, hash, id ){
    let query = "update organization_file of set file_url = '"+ url + "', hash_content = '"+ hash + "' where of.id = '"+ id + "'";
    return query;
}

function getQueryAllDocumentsByOrganizationByDate(organization_id, date, limit, offset){
let query = "select c.document_type,c.cdr_file_id, c.xml_file_id, da.name, da.value, da.document_id from document c, document_attribute da where c.organization_id = '"+organization_id+ "'and c.id=da.document_id and da.name ='issueDate' and da.value like '"+date+"'  order by c.created_timestamp limit '"+limit+"' offset '"+offset+"'";
return query;
}

function getQueryCountAllDocumentsByOrganizationByDate(organization_id, date){
    let query = "select count(*) total from document c, document_attribute da where c.organization_id = '"+organization_id+ "'and c.id=da.document_id and da.name ='issueDate' and da.value like '"+date+"'";
    return query;
}

function getQueryTotalFilesByOrganization(organization_id){
    let query = "select count(*) total from organization_file of where of.organization_id ='"+organization_id+"';"
    return query;
}

// function getQueryOneDocumentByName(organization_id, file_name){
//     let query = "select * from organization_file of where of.organization_id ='"+organization_id+"' and of.file_name ='"+file_name+ "';"
//     return query;
// }

// function getQueryOneDocumentXmlId(xml_file_id){
//     let query = "select d.id from document d where d.xml_file_id ='"+ xml_file_id +"';"
//     return query;
// }

function getQueryAllDocumentsIsNotUpload(organization_id, limit, offset){
    //let query = "select d.* from document d inner join organization_file of on d.xml_file_id = of.id where d.organization_id ='"+organization_id+"' and  d.issue_date >='2019-04-01' and d.issue_date<='2019-05-01' and of.file_url isnull limit '"+limit+"' offset '"+offset+"'";
    let query = "select d.* from document d inner join organization_file of on d.xml_file_id = of.id where d.organization_id ='"+organization_id+"' and of.file_url isnull limit '"+limit+"' offset '"+offset+"'";
    return query;
}

function getQueryCountDocumentsIsNotUpload(organization_id){
    let query = "select count(*) total from document d inner join organization_file of on d.xml_file_id = of.id where d.organization_id ='"+organization_id+"' and of.file_url isnull;";
    return query;
}

function updateDocument(xml_file_id ){
    let query = "update document d set is_file_db_storage = 0 where d.xml_file_id ='"+ xml_file_id + "'";
    return query;
}

module.exports = {
    getQuerySelectAllDocuments,
    getQueryCountDocumentsByOrganization,
    getQueryReportVentas,
    getQueryFindOrganization,
    getQueryFindOrganizationStorageConfig,
    getQuerySharedDocuments,
    getOrganizationByName,
    getQueryAllDocumentsOrganizationId,
    getQueryFileById,
    getQueryFileNameById,
    updateFile,
    getQueryCountDocumentsOrganizationId,
    getQueryAllDocumentsByOrganizationByDate,
    getQueryCountAllDocumentsByOrganizationByDate,
    getQueryTotalFilesByOrganization,
   // getQueryOneDocumentXmlId,
    updateDocument,
    getQueryAllDocumentsIsNotUpload,
    getQueryCountDocumentsIsNotUpload
}