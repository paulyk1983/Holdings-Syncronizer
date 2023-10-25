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
    "Account Name": SelectProperty,
    "Percent Of Account": NumberProperty,
    "Today's Gain/Loss Dollar": RichTextProperty,
    "Total Gain/Loss Percent": RichTextProperty,
    "Account Number": NumberProperty,
    "Total Gain/Loss Dollar": RichTextProperty,
    "Current Value": RichTextProperty,
    "Last Price Change": RichTextProperty,
    "Average Cost Basis": RichTextProperty,
    "Quantity": NumberProperty,
    "Description": RichTextProperty,
    "Today's Gain/Loss Percent": RichTextProperty,
    "Last Price": RichTextProperty,
    "Type": SelectProperty,
    "Cost Basis Total": RichTextProperty,
    "Symbol": TitleProperty
}

export interface TitleProperty {
    "id": string | undefined,
    "type": "title",
    "title": Array<RichTextItemResponse>
}
export interface NumberProperty {
    "id": string | undefined,
    "type": "number",
    "number": number
}
export interface RichTextProperty {
    "id": string | undefined,
    "type": "rich_text",
    "rich_text": Array<RichTextItemResponse>
}

export interface TitlePropertyWrite {
    "id": string | undefined,
    "type": "title",
    "title": Array<RichTextItemRequest>
}

export interface RichTextPropertyWrite {
    "id": string | undefined,
    "type": "rich_text",
    "rich_text": Array<RichTextItemRequest>
}

export interface SelectProperty {
    "id": string | undefined,
    "type": "select",
    "select": {
        "id": string,
        "name": string,
        "color": ColorOptions
    }
}

// derived from Notion library v2.2.3
export type ColorOptions = "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red";
export interface RichTextItemRequest {
    text: {
        content: string;
        link?: {
            url: string;
        } | null;
    };
    type?: "text";
    annotations?: {
        bold?: boolean;
        italic?: boolean;
        strikethrough?: boolean;
        underline?: boolean;
        code?: boolean;
        color?: ColorOptions;
    };
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
