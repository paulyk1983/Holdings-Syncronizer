import { Client } from "@notionhq/client"
import { 
  PageObjectResponse, 
  SearchParameters, 
  QueryDatabaseResponse, 
  RichTextItemResponse, 
  UpdatePageParameters, 
  CreatePageParameters
} from "@notionhq/client/build/src/api-endpoints"
import { NotionQueryRequestBody } from '../types/notion.types'

/* TODOs:
- create custom type for 'imported' and 'holding' Notion page properties
- build mapper
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
  console.log('holdings arrays for execution build!')

  holdingsToUpdate.forEach(async(holding) => {    
    await updateExistingHolding(holding.id, holding.properties)
  });
  holdingsToAdd.forEach(async(holding) => {
    await addNewHolding(holdingsDatabaseId, holding.properties)
  });
  holdingsToRemove.forEach(async(holding) => {
    await removeHolding(holding.id)
  });
  
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

export const getHoldingsToRemove = (importedDatabaseContent:Array<PageObjectResponse>, holdingsDatabaseContent:Array<PageObjectResponse>) => {
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

  return holdingsToRemove
}

export const getHoldingsToUpdate = (importedDatabaseContent:Array<PageObjectResponse>, holdingsDatabaseContent:Array<PageObjectResponse>) => {
  const holdingsToRemove = getHoldingsToRemove(importedDatabaseContent, holdingsDatabaseContent)
  let holdingsToUpdate:any[] = []

  importedDatabaseContent.forEach(rowFromImport => {
    holdingsToRemove.forEach(holdingToRemove => {
      if (rowFromImport.id != holdingToRemove.id) {
        holdingsToUpdate.push(rowFromImport)
      }
    });
  });

  return holdingsToUpdate
}

// Mapper

// export const mapImportToHoldingsProperties = (importPage) {

// }

