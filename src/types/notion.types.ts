import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"

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
    properties: ImportedFidelityProperties
}

export interface TitleOrRichText {
    "type": string,
    "text": {
        "content": string,
        "link"?: null | string
    },
    "annotations"?: {
        "bold": boolean,
        "italic": boolean,
        "strikethrough": boolean,
        "underline": boolean,
        "code": boolean,
        "color": string
    },
    "plain_text": string,
    "href"?: null | string 
}

export interface ImportedFidelityProperties {
    "Account Name": {
        "id": string,
        "type": "select",
        "select": {
            "id": string,
            "name": "IRA - BDA",
            "color": string
        }
    },
    "Percent Of Account": {
        "id": string,
        "type": "number",
        "number": number
    },
    "Today's Gain/Loss Dollar": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Total Gain/Loss Percent": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Account Number": {
        "id": string,
        "type": "number",
        "number": number
    },
    "Total Gain/Loss Dollar": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Current Value": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Last Price Change": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Average Cost Basis": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Quantity": {
        "id": string,
        "type": "number",
        "number": number
    },
    "Description": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Today's Gain/Loss Percent": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Last Price": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Type": {
        "id": string,
        "type": "select",
        "select": {
            "id": string,
            "name": "Cash",
            "color": string
        }
    },
    "Cost Basis Total": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[]
    },
    "Symbol": TitleContainer
}

export interface TitleContainer {
    "id": string,
    "type": "title",
    "title": Array<RichTextItemResponse>
}

export interface EnhancedFidelityPropertiesUpdate {
    "Percent of Portfolio": {
        "id": string,
        "type": "number",
        "number": number
    },
    "Description": {
        "id": string,
        "type": "rich_text",
        "rich_text": TitleOrRichText[] | {}
    },
    "Current Price": {
        "id": string,
        "type": "number",
        "number": number
    },
    "Symbol": {
        "id": string,
        "type": "title",
        "title": TitleOrRichText[] | {}
    }
}

export interface EnhancedFidelityPropertiesCreate {
    "Percent of Portfolio": {
        "type": "number",
        "number": number
    },
    "Description": {
        "type": "rich_text",
        "rich_text": TitleOrRichText[] | {}
    },
    "Current Price": {
        "type": "number",
        "number": number
    },
    "Symbol": {
        "type": "title",
        "title": TitleOrRichText[] | {}
    }
}
