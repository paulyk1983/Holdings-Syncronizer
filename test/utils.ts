import { TitleProperty } from "../src/types/notion.types";

export const buildMockTitleProperty = (titleValue:string):TitleProperty => {
    return {
        "id": "title",
        "type": "title" as "title",
        "title": [
            {
                "type": "text",
                "text": {
                    "content": titleValue,
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
                "plain_text": titleValue,
                "href": null
            }
        ]
    }
}