import { Client } from "@notionhq/client"
import { 
  PageObjectResponse, 
  SearchParameters, 
  QueryDatabaseResponse, 
  RichTextItemResponse, 
  UpdatePageParameters, 
  CreatePageParameters
} from "@notionhq/client/build/src/api-endpoints"
import { 
  EnhancedFidelityPropertiesCreate,
  EnhancedFidelityPropertiesUpdate,
  ImportedFidelityProperties, 
  NotionQueryRequestBody, 
  TitleProperty, 
  TitleOrRichText,
  NumberProperty,
  RichTextPropertyWrite,
  TitlePropertyWrite
} from '../types/notion.types'

/* TODOs:
- implement and workout any bugs
- environmentalize Ids
- refactor
*/

export const updateHoldingsDatabase = async ():Promise<void> => {
  console.log('Starting holdings sync...')

  // need to query for db every time because an updated csv import may change the id
  const importedDbId:string = await getCsvImportDatabaseId()
  const importedDatabase:QueryDatabaseResponse = await queryDatabase(importedDbId)

  // TODO: environmentalize this id
  const holdingsDatabaseId:string = 'de9192ff-3648-47c0-9c15-63dea489313d'
  const holdingsDatabase:QueryDatabaseResponse = await queryDatabase(holdingsDatabaseId)

  const importDbResults = importedDatabase.results as Array<PageObjectResponse>
  const holdingsDbResults = holdingsDatabase.results as Array<PageObjectResponse>

  console.log('Building holding arrays for execution...')
  const holdingsToAdd = getHoldingsToAdd(importDbResults, holdingsDbResults)
  const holdingsToRemove = getHoldingsToRemove(importDbResults, holdingsDbResults)
  const holdingsToUpdate = getHoldingsToUpdate(importDbResults, holdingsDbResults)
  console.log('holdings arrays for execution built!')

  for (const holding of holdingsToUpdate) {
    await updateExistingHolding(
      holding.id, 
      transformFidelityPageProperties(holding.properties, true)
    )
  }
  for (const holding of holdingsToAdd) {
    await addNewHolding(
      holdingsDatabaseId, 
      transformFidelityPageProperties(holding.properties)
    )
  }
  for (const holding of holdingsToRemove) {
    await removeHolding(holding.id)
  }

  console.log('holdings sync complete!')
}

// refactor: This could made more generic
export const getCsvImportDatabaseId = async ():Promise<string> => {
  console.log("Retrieving csv-imported database...")

  // Initializing a client
  const notionClient = new Client({
    auth: process.env.NOTION_TOKEN,
  })
  const requestBody:SearchParameters = {
    "query": "Portfolio_Positions",
    "sort": {
        "direction": "ascending",
        "timestamp": "last_edited_time"
    }
  }
  const notionResponse = await notionClient.search(requestBody)

  if (notionResponse.results.length === 0) {
    throw new Error("No databases that include 'Portfolio_Positions' could be found")
  }
  if (notionResponse.results.length > 1) {
    throw new Error("Multiple databases that include 'Portfolio_Positions' were found but I do not know which one you want, so I'm throwing an error.")
  }

const databaseId = notionResponse.results[0].id

console.log("csv-imported database retrieved!")
return databaseId
}

export const queryDatabase = async (databaseId:string) => {
  console.log(`Querying database with id:${databaseId}...`)

  // Initializing a client
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })

  const requestBody:NotionQueryRequestBody = {
    database_id: databaseId,
  }
  const result = await notion.databases.query(requestBody)
  
  console.log(`Database with id ${databaseId} queried!`)
  return result
}

// refactor: This could made more generic
export const updateExistingHolding = async (holdingId:string, holding:any) => {
  console.log('Updating existing holding...')

  // Initializing a client
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })
  const params:UpdatePageParameters = {
    page_id: holdingId,
    properties: holding
  }

  try {
    await notion.pages.update(params)
    
    console.log('Holding updated!')
  } catch (error) {
    console.log(`Error updating holding Notion page with id: ${holdingId}:`)
    console.log(error)
  }
}

// refactor: This could made more generic
export const addNewHolding = async (databaseId:string, holding:any) => {
  console.log('Adding new holding...')

  // Initializing a client
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })
  const params:CreatePageParameters = {
    parent: {
      database_id: databaseId,
      type: "database_id"
    },
    properties: holding
  }

  try {
    await notion.pages.create(params)

    console.log('New holding added!')
  } catch (error) {
    console.log(`Error adding new holding Notion page:`)
    console.log(error)
  }
}

// refactor: This could made more generic
export const removeHolding = async (holdingId:string) => {
  console.log('Removing holding...')

  // Initializing a client
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })
  
  try {
    await notion.pages.update({
      page_id: holdingId,
      archived: true,
    });

    console.log('Holding removed!')
  } catch (error) {
    console.log(`Error removing holding Notion page with id of ${holdingId}:`)
    console.log(error)
  }
}

/*
  Helpers
*/
export const getHoldingsToAdd = (importedDatabaseContent:Array<PageObjectResponse>, holdingsDatabaseContent:Array<PageObjectResponse>) => {
  console.log('Building holdingsToAdd array...')

  const holdingsToAdd:any[] = []
  importedDatabaseContent.forEach(rowFromImport => {

    let rowExists = false
    
    holdingsDatabaseContent.forEach(rowFromHoldings  => {
      const tickerSymbolObjectFromImport = rowFromImport.properties.Symbol as {
        type: "title";
        title: Array<RichTextItemResponse>;
        id: string;
      }
      const tickerSymbolObjectFromHoldings = rowFromHoldings.properties.Symbol as {
        type: "title";
        title: Array<RichTextItemResponse>;
        id: string;
      }
    
      if (tickerSymbolObjectFromHoldings.title.length === 0 || tickerSymbolObjectFromImport.title[0].plain_text == tickerSymbolObjectFromHoldings.title[0].plain_text) {
        rowExists = true
      }
    });

    if (!rowExists) {
      holdingsToAdd.push(rowFromImport)
    }
  });

  console.log('...holdingsToAdd array built!')
  return holdingsToAdd
}

export const listOfPagesToRemove = (importedDatabasePages:Array<PageObjectResponse>, enhancedDatabasePages:Array<PageObjectResponse>) => {
  console.log('Building holdingsToRemove array...')

  const enhancedPagesToRemove = enhancedDatabasePages.filter((enhancedPage) => {
    const enhancedSymbolObj = enhancedPage.properties.Symbol as TitleProperty

    return !enhancedSymbolObj 
      || enhancedSymbolObj.title.length === 0 
      || !importedDatabasePages.find((importedPage) => {
        const importedSymbolObj = importedPage.properties.Symbol as TitleProperty
        return getTitleValue(importedSymbolObj) === getTitleValue(enhancedSymbolObj)
      }) 
  })

  console.log('holdingsToRemove array Built!')
  return enhancedPagesToRemove
}
export const getHoldingsToRemove = (importedDatabaseContent:Array<PageObjectResponse>, holdingsDatabaseContent:Array<PageObjectResponse>) => {
  console.log('Building holdingsToRemove array...')

  const holdingsToRemove:any[] = []
  

  holdingsDatabaseContent.forEach(rowFromHoldings => {
    let rowExists = false
    importedDatabaseContent.forEach(rowFromImport => {
      const tickerSymbolObjectFromImport = rowFromImport.properties.Symbol as {
        type: "title";
        title: Array<RichTextItemResponse>;
        id: string;
      }
      const tickerSymbolObjectFromHoldings = rowFromHoldings.properties.Symbol as {
        type: "title";
        title: Array<RichTextItemResponse>;
        id: string;
      }

      // if no symbol value, treat as row to remove
      if (tickerSymbolObjectFromHoldings.title.length != 0 && tickerSymbolObjectFromImport.title[0].plain_text == tickerSymbolObjectFromHoldings.title[0].plain_text) {
        rowExists = true
      }
    });

    if (!rowExists) {
      holdingsToRemove.push(rowFromHoldings)
    }
  });

  console.log('holdingsToRemove array Built!')
  return holdingsToRemove
}

// TODO: this function is flawed. should not be comparing ids. also, use for of or map instead of forEach
export const getHoldingsToUpdate = (importedDatabaseContent:Array<PageObjectResponse>, holdingsDatabaseContent:Array<PageObjectResponse>) => {
  console.log('Building holdingsToUpdate array...')
  const holdingsToRemove = getHoldingsToRemove(importedDatabaseContent, holdingsDatabaseContent)
  let holdingsToUpdate:any[] = []

  // Any row with non-matching Symbol property against the delete list is one to be updated
  importedDatabaseContent.forEach(rowFromImport => {
    holdingsToRemove.forEach(holdingToRemove => {
      if (rowFromImport.properties.Symbol != holdingToRemove.properties.Symbol) {
        // Potential code smell here, but refactoring this means re-orienting these PageObjectRespose types
        rowFromImport.id = holdingToRemove.id
        holdingsToUpdate.push(rowFromImport)
      }
    });
  });

  console.log('holdingsToAdd array  Built!')
  return holdingsToUpdate
}

// include pageIds for update request page. Do not for create page request
export const transformFidelityPageProperties = (importPageProperties:ImportedFidelityProperties, includePageIds?:boolean):EnhancedFidelityPropertiesUpdate|EnhancedFidelityPropertiesCreate => {
  return {
    "Symbol": buildTitleProperty(getTitleValue(importPageProperties.Symbol), includePageIds ? importPageProperties.Symbol.id: undefined), // These could be refatored using '||'
    "Description": buildRichTextProperty(importPageProperties.Description.rich_text[0].plain_text, includePageIds ? importPageProperties.Description.id: undefined),
    "Percent of Portfolio": buildNumberProperty(importPageProperties["Percent Of Account"].number, includePageIds ? importPageProperties["Percent Of Account"].id: undefined),
    "Current Price": buildNumberProperty(importPageProperties['Last Price'].rich_text[0].plain_text, includePageIds ? importPageProperties["Last Price"].id: undefined)
  } 
}

// Notion Object Helpers
export const buildTitleProperty = (content:string, id?:string|undefined):TitlePropertyWrite => {
  return {
    "id": id,
    "type": "title" as "title",
    "title": [{
      "text": {
        "content": content
      }
    }]
  }
}
export const buildRichTextProperty = (content:string, id?:string|undefined):RichTextPropertyWrite => {
  return {
    "id": id,
    "type": "rich_text" as "rich_text",
    "rich_text": [{
      "text": {
        "content": content
      }
    }]
  }
}
export const buildNumberProperty = (number:number|string, id?:string|undefined):NumberProperty => {
  console.log(`Building number property with input: ${number}`)
  
  if (typeof number === 'string') {
    number = Number(number.replace('$', ''))
    if (Number.isNaN(number)) {
      console.log(`Error: could not convert string, ${number} to a number.`)
      number = 0
    }
  }

  const numberProperty:NumberProperty = {
    "id": id,
    "type": "number" as "number",
    "number": number,
  }

  return numberProperty
}
export const getTitleValue = (titleObject:TitleProperty):string => {
  return titleObject.title[0].plain_text
}

