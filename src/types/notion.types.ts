export interface NotionResponseBody {
    results:ResultsObject[]
}

export interface NotionSearchRequestBody {
    query: string
    sort: {
        direction: string
        timestamp: string
    }
}

export interface NotionQueryRequestBody {
    database_id: string
}

export interface NotionUpdateRequestBody {
    archived?: boolean
}

export interface ResultsObject {
    id: string
    properties: any
}

// "results": [
//     {
//         "object": "database",
//         "id": "2934be7a-12a6-4e0c-8ebb-8d789cf79ace",
//         "cover": null,
//         "icon": null,
//         "created_time": "2023-03-18T18:58:00.000Z",
//         "created_by": {
//             "object": "user",
//             "id": "62a31505-bfc4-439d-949f-2687f3aa901a"
//         },
//         "last_edited_by": {
//             "object": "user",
//             "id": "62a31505-bfc4-439d-949f-2687f3aa901a"
//         },
//         "last_edited_time": "2023-03-25T17:33:00.000Z",
//         "title": [
//             {
//                 "type": "text",
//                 "text": {
//                     "content": "Portfolio_Positions_Mar-08-2023",
//                     "link": null
//                 },
//                 "annotations": {
//                     "bold": false,
//                     "italic": false,
//                     "strikethrough": false,
//                     "underline": false,
//                     "code": false,
//                     "color": "default"
//                 },
//                 "plain_text": "Portfolio_Positions_Mar-08-2023",
//                 "href": null
//             }
//         ],
//         "description": [],
//         "is_inline": false,
//         "properties": {
//             "Account Name": {
//                 "id": "%3BcxO",
//                 "name": "Account Name",
//                 "type": "select",
//                 "select": {
//                     "options": [
//                         {
//                             "id": "mezJ",
//                             "name": "IRA - BDA",
//                             "color": "red"
//                         }
//                     ]
//                 }
//             },
//             "Percent Of Account": {
//                 "id": "%3Dt%3D%5C",
//                 "name": "Percent Of Account",
//                 "type": "number",
//                 "number": {
//                     "format": "percent"
//                 }
//             },
//             "Today's Gain/Loss Dollar": {
//                 "id": "D%3A~g",
//                 "name": "Today's Gain/Loss Dollar",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Total Gain/Loss Percent": {
//                 "id": "Fj%60%7D",
//                 "name": "Total Gain/Loss Percent",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Account Number": {
//                 "id": "F%7D%7Dg",
//                 "name": "Account Number",
//                 "type": "number",
//                 "number": {
//                     "format": "number"
//                 }
//             },
//             "Total Gain/Loss Dollar": {
//                 "id": "Gnj%3D",
//                 "name": "Total Gain/Loss Dollar",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Current Value": {
//                 "id": "MvKz",
//                 "name": "Current Value",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Last Price Change": {
//                 "id": "Np%3E%3A",
//                 "name": "Last Price Change",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Average Cost Basis": {
//                 "id": "P%7D~D",
//                 "name": "Average Cost Basis",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Quantity": {
//                 "id": "U%5C%5Dm",
//                 "name": "Quantity",
//                 "type": "number",
//                 "number": {
//                     "format": "number"
//                 }
//             },
//             "Description": {
//                 "id": "%60OiX",
//                 "name": "Description",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Today's Gain/Loss Percent": {
//                 "id": "fSY%5C",
//                 "name": "Today's Gain/Loss Percent",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Last Price": {
//                 "id": "nQ%3B%3B",
//                 "name": "Last Price",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Type": {
//                 "id": "wZmm",
//                 "name": "Type",
//                 "type": "select",
//                 "select": {
//                     "options": [
//                         {
//                             "id": ";H><",
//                             "name": "Cash",
//                             "color": "yellow"
//                         }
//                     ]
//                 }
//             },
//             "Cost Basis Total": {
//                 "id": "xdam",
//                 "name": "Cost Basis Total",
//                 "type": "rich_text",
//                 "rich_text": {}
//             },
//             "Symbol": {
//                 "id": "title",
//                 "name": "Symbol",
//                 "type": "title",
//                 "title": {}
//             }
//         },
//         "parent": {
//             "type": "page_id",
//             "page_id": "c67f0e9e-0cb2-486d-acc9-d5c9406e863c"
//         },
//         "url": "https://www.notion.so/2934be7a12a64e0c8ebb8d789cf79ace",
//         "archived": false
//     }
// ],