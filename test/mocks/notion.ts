import {Chance} from 'chance'
import { ColorOptions, ImportedFidelityProperties } from '../../src/types/notion.types';

const chance = new Chance();

// TODO: figure out type error
// export const buildPageFromImportedFidelityDatabase = ():ImportedFidelityProperties => {
//     const symbolString = chance.string({length:3, pool:'abcdefghijklmnop'})
//     const descriptionString = chance.sentence()
//     const lastPriceString = `$${chance.natural()}`
//     return {
//         Symbol: {
//             id: chance.string({pool:'abcd1234'}),
//             name: "Symbol",
//             type: "title" as "title",
//             title: [
//                 {
//                     "type": "text" as "text",
//                     "text": {
//                         "content": symbolString,
//                         "link": null
//                     },
//                     "annotations": buildAnnotationsObject(),
//                     "plain_text": symbolString,
//                     "href": null
//                 }
//             ]
//         },
//         Description: {
//             id: chance.string({pool:'abcd1234'}),
//             name: "Description",
//             type: "rich_text" as "rich_text",
//             rich_text: [
//                 {
//                     "type": "text" as "text",
//                     "text": {
//                         "content": descriptionString,
//                         "link": null
//                     },
//                     "annotations": buildAnnotationsObject(),
//                     "plain_text": descriptionString,
//                     "href": null
//                 }
//             ]
//         },
//         "Percent Of Account": {
//             "id": chance.string({pool:'abcd1234'}),
//             "type": "number" as "number",
//             "number": chance.natural()
//         },
//         "Last Price": {
//             "id": chance.string({pool:'abcd1234'}),
//             "type": "rich_text" as "rich_text",
//             "rich_text": [
//                 {
//                     "type": "text" as "text",
//                     "text": {
//                         "content": lastPriceString,
//                         "link": null
//                     },
//                     "annotations": buildAnnotationsObject(),
//                     "plain_text": lastPriceString,
//                     "href": null
//                 }
//             ]
//         },
//         ...staticFidelityObject
//     }
    
// }

const staticFidelityObject = {
    "Account Name": {
        "id": "%3BcxO",
        "type": "select",
        "select": {
            "id": "mezJ",
            "name": "IRA - BDA",
            "color": "red"
        }
    },
    "Today's Gain/Loss Dollar": {
        "id": "D%3A~g",
        "type": "rich_text",
        "rich_text": [
            {
                "type": "text",
                "text": {
                    "content": "+$1.35",
                    "link": null
                },
                "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                },
                "plain_text": "+$1.35",
                "href": null
            }
        ]
    },
    "Total Gain/Loss Percent": {
        "id": "Fj%60%7D",
        "type": "rich_text",
        "rich_text": [
            {
                "type": "text",
                "text": {
                    "content": "-71.16%",
                    "link": null
                },
                "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                },
                "plain_text": "-71.16%",
                "href": null
            }
        ]
    },
    "Account Number": {
        "id": "F%7D%7Dg",
        "type": "number",
        "number": 236032391
    },
    "Total Gain/Loss Dollar": {
        "id": "Gnj%3D",
        "type": "rich_text",
        "rich_text": [
            {
                "type": "text",
                "text": {
                    "content": "-$2784.51",
                    "link": null
                },
                "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                },
                "plain_text": "-$2784.51",
                "href": null
            }
        ]
    },
    "Current Value": {
        "id": "MvKz",
        "type": "rich_text",
        "rich_text": [
            {
                "type": "text",
                "text": {
                    "content": "$1128.60",
                    "link": null
                },
                "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                },
                "plain_text": "$1128.60",
                "href": null
            }
        ]
    },
    "Last Price Change": {
        "id": "Np%3E%3A",
        "type": "rich_text",
        "rich_text": [
            {
                "type": "text",
                "text": {
                    "content": "+$0.05",
                    "link": null
                },
                "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                },
                "plain_text": "+$0.05",
                "href": null
            }
        ]
    },
    "Average Cost Basis": {
        "id": "P%7D~D",
        "type": "rich_text",
        "rich_text": [
            {
                "type": "text",
                "text": {
                    "content": "$144.93",
                    "link": null
                },
                "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                },
                "plain_text": "$144.93",
                "href": null
            }
        ]
    },
    "Quantity": {
        "id": "U%5C%5Dm",
        "type": "number",
        "number": 27
    },
    "Today's Gain/Loss Percent": {
        "id": "fSY%5C",
        "type": "rich_text",
        "rich_text": [
            {
                "type": "text",
                "text": {
                    "content": "+0.11%",
                    "link": null
                },
                "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                },
                "plain_text": "+0.11%",
                "href": null
            }
        ]
    },
    "Type": {
        "id": "wZmm",
        "type": "select",
        "select": {
            "id": ";H><",
            "name": "Cash",
            "color": "yellow"
        }
    },
    "Cost Basis Total": {
        "id": "xdam",
        "type": "rich_text",
        "rich_text": [
            {
                "type": "text",
                "text": {
                    "content": "$3913.11",
                    "link": null
                },
                "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                },
                "plain_text": "$3913.11",
                "href": null
            }
        ]
    }  
}

const buildAnnotationsObject = () => {
    const colorOptions = ['default', 'red', 'yellow', 'blue', 'green', 'orange']

    return {
        "bold": chance.bool(),
        "italic": chance.bool(),
        "strikethrough": chance.bool(),
        "underline": chance.bool(),
        "code": chance.bool(),
        "color": chance.pickone(colorOptions) as ColorOptions
    }
}