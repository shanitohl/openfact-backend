'use strict'

function getQuerySelectAllDocuments(organization_id, filter) {
    let querySelect = `select d.id,d.document_id,d.issue_date,d.document_currency_code,a.value total,d.customer_assigned_account_id,d.customer_registration_name,d.baja_en_proceso,d.status 
                        from document d 
                        inner join document_attribute a on d.id = a.document_id and a.name= 'totalOperacionesGravadas' 
                        inner join document_required_action c on d.id = c.document_id`
    let queryWhere = ` where organization_id = '` + organization_id + "'";;

    filter.filters.forEach(element => {
        if (element.name == "createdTimestamp")
            queryWhere = queryWhere + " and created_timestamp > '" + element.value + "'";
        if (element.name == "documentId")
            queryWhere = queryWhere + " and d.document_id like '" + element.value.replace("*", "") + "%'";
        if (element.name == "document_type")
            queryWhere = queryWhere + " and document_type='" + element.value + "'";
        if (element.name == "status")
            queryWhere = queryWhere + " and status='" + element.value + "'";
        if (element.name == "requiredActions")
            queryWhere = queryWhere + " and required_action='" + element.value + "'";
    });
    if (filter.filterText != null)
        queryWhere = queryWhere + " and (a.value like '%" + filter.filterText + "%'  or d.document_id like '%" + filter.filterText + "%'  or d.customer_assigned_account_id like '%" + filter.filterText + "%' or d.customer_registration_name like '%" + filter.filterText + "%')"

    filter.orders.forEach(element => {
        if (element.name == "createdTimestamp") {           
                if (element.ascending)
                    queryWhere = queryWhere + " order by d.created_timestamp asc";
                else
                    queryWhere = queryWhere + " order by d.created_timestamp desc ";            
        }
    });
    if (filter.paging != null)
        queryWhere = queryWhere + " LIMIT  " + filter.paging.pageSize + " OFFSET  " + filter.paging.page + " ;"

    console.log(querySelect + " " + queryWhere);
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
                    opExonerada.value                   as exonerada,
                    opInafecta.value                    as inafecta,
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
                left join document_attribute opInafecta on doc.id = opInafecta.document_id and a.name = 'totalOperacionesInafectas'
                left join document_attribute opExonerada on doc.id = opExonerada.document_id and a.name = 'totalOperacionesExoneradas'
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


module.exports = {
    getQuerySelectAllDocuments,
    getQueryCountDocumentsByOrganization,
    getQueryReportVentas,
    getQueryFindOrganization,
    getQueryFindOrganizationStorageConfig,
    getQuerySharedDocuments
}