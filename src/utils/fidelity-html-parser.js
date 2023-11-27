// generated from chatGCP 10/25/23

// get html as string
const fs = require('fs')
const path = require('path')
const htmlparser2 = require('htmlparser2')

function HTMLFileToString(filePath) {
  try {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    return htmlContent;
  } catch (error) {
    console.error(`Error reading HTML file: ${error}`);
    return null;
  }
}

// Get account Number (with the help of chatGCP):
function findBrokerageNumber(htmlString) { 
  const searchText = 'Brokerage:'

  let insideSpan = false;
  let brokerageAccountNumber = '';
  const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
      if (name === 'span') {
        insideSpan = true;
      }
    },
    ontext(text) {
      if (insideSpan && text.indexOf(searchText) != -1) {
        brokerageAccountNumber = text.substring(text.indexOf(searchText)+searchText.length).trim();
        insideSpan = false; // Stop parsing after finding the Brokerage account number
      }
    },
  }, { decodeEntities: true });

  parser.write(htmlString);
  parser.end();

  return brokerageAccountNumber;
}

function extractTextFromHtml(htmlString) { 

  let textString = '';
  const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
    },
    ontext(text) {
      textString = textString+', ' + text
    },
  }, { decodeEntities: true });

  parser.write(htmlString);
  parser.end();

  return textString;
}

function getColumnNames(htmlString) {
  const columnNames = []
  let insideElement = false
  const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
      if (
        name === "span" && 
        attribs.ref === 'eText' && 
        attribs.class === "ag-header-cell-text"
      ) {
        insideElement = true;
      }
    },
    ontext(text) {
      if (insideElement) {
        insideElement = false
        columnNames.push(text)
      }
    },
  },{ decodeEntities: true });

  parser.write(htmlString);
  parser.end();

  return columnNames
}

function getSymbols(htmlString) {
  const symbols = []
  let insideElement = false
  const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
      if (
        name === "button" && 
        attribs.class === "posweb-cell-symbol-name pvd-btn btn-anchor"
      ) {
        insideElement = true;
      }
    },
    ontext(text) {
      if (insideElement) {
        insideElement = false
        symbols.push(text)
      }
    },
  },{ decodeEntities: true });

  parser.write(htmlString);
  parser.end();

  return symbols
}

// Data ignored: 52-week-range
function getRowData(htmlString) {
  const rowCellTextValues = []
  let rowArray = []
  let textValueArray = []
  let insideContainer = false
  let insideRow = false
  let insideGridCell = false
  let insideSpan = false
  let insideSingleSpan = false
  let insideMultipleSpan = false
  let containerDivs = 0
  let rowDivs = 0
  let gridCellDivs = 0
  let endOfMultipleValues = false
  let isStackedCell = false
  let gridCellName = null
  let isCostBasisPerShareSpan = false
  const singleCellClassSubstring = 'posweb-cell posweb-cell-'
  const stackedCellClassSubstring = 'posweb-cell-stacked posweb-cell-stacked-'
  const stackedCellClassSubstringItem = "posweb-cell-stacked-item posweb-cell-stack-item-"
  
  let obj = {}

  const parser = new htmlparser2.Parser({
    // Last column, '52-week range' is ignored
    onopentag(name, attribs) {
      if (name === "div" && insideContainer === true) {
        containerDivs += 1
      }
      if (name === "div" && insideRow === true) {
        rowDivs += 1
      }
      if (name === "div" && insideGridCell === true) {
        gridCellDivs += 1
      }

      if (
        name === "div" && attribs.class === "ag-center-cols-container"
      ) {
        insideContainer = true;
      }

      if (
        insideContainer === true &&
        name === "div" &&
        attribs['comp-id'] &&
        attribs['role'] === "row"
      ) {
        insideRow = true
      }

      if (
        insideRow === true &&
        name === "div" &&
        attribs['role'] === "gridcell"
      ) {        
        insideGridCell = true
        
        // cells with stacked (double) or single values
        if(attribs.class && attribs.class.indexOf(stackedCellClassSubstring) != -1) {
          isStackedCell = true

          const indexStart = attribs.class.indexOf(stackedCellClassSubstring)
          gridCellName = attribs.class.substring(indexStart+stackedCellClassSubstring.length)
        } else {
          isStackedCell = false

          const indexStart = attribs.class.indexOf(singleCellClassSubstring)
          gridCellName = attribs.class.substring(indexStart+singleCellClassSubstring.length)
        }
      }

      if (
        insideGridCell &&
        name === "span" && 
        attribs.class
      ) {
       
        if (isStackedCell) {
          if (gridCellName === "cost_basis" && attribs.class.indexOf("cost_basis_per_share") != -1) {
            insideSpan = true
            gridCellName = "cost_basis_per_share"
          }
          if (attribs.class.indexOf(stackedCellClassSubstringItem) != -1) {
            insideSpan = true
            const indexStart = attribs.class.indexOf(stackedCellClassSubstringItem)
            gridCellName = attribs.class.substring(indexStart+stackedCellClassSubstringItem.length)

            if (gridCellName.indexOf(' ') === gridCellName.length-1) {
              gridCellName = gridCellName.substring(0, gridCellName.length-1)
            }
            const indexOfFirstSpace = gridCellName.indexOf(' ')
            if(indexOfFirstSpace != -1) {
              gridCellName = gridCellName.substring(0, indexOfFirstSpace)
            }
            
          }
        } else if (attribs.class === "ag-cell-value") {
          insideSpan = true
        }
      }
    },
    ontext(text) {
      if (insideSpan) {
        text = text.replace(/\n/, 'n/a')
        text = text.replace('--', 'n/a')
        text = text.replace(/ /g, '')

        obj[gridCellName] = text
        
        // TODO: add to rowCellTextValues instead of consoling to log
        // TODO: combine with Symbol field
        // rowCellTextValues.push([gridCellName, text])

        if (gridCellName === "cost_basis_per_share") {
          console.log(obj)
          obj = {}
        }
        insideSpan = false       
      }
    },
    onclosetag(name) {      
      if (name === 'div' && insideContainer === true) {
        containerDivs -= 1

        if (containerDivs <= 0) {
          insideContainer === false
        }
      }
      if (name === 'div' && insideRow === true) {
        rowDivs -= 1

        if (rowDivs <= 0) {
          insideRow === false
        }
      }
      if (name === 'div' && insideGridCell === true) {
        gridCellDivs -= 1

        if (gridCellDivs <= 0) {
          insideGridCell === false
        }
      }

      if (insideSpan) {
        rowCellTextValues.push([gridCellName, 'n/a'])
      }
      insideSpan = false
    }
  },{ decodeEntities: true });

  parser.write(htmlString);
  parser.end();

  rowCellTextValues.shift()
  return rowCellTextValues
}

// Specify the path to your HTML file
const htmlFilePath = path.normalize(path.resolve(__dirname)+'/../../test/sample-data/fidelity-html2.html')

let htmlString = HTMLFileToString(htmlFilePath)
// const accountNumber = findBrokerageNumber(htmlString);
// const columnNamesArray = getColumnNames(htmlString)
const symbolsArray = getSymbols(htmlString)
const arraysOfRowData = getRowData(htmlString)
// console.log(symbolsArray)
// console.log(arraysOfRowData)

// Check that number of symbols and number of other row data is equal
if (symbolsArray.length != arraysOfRowData.length) {
  throw Error(`number of Symbols (${symbolsArray.length}) and number of other row data (${arraysOfRowData.length}) does not match`)
}

let i = 0
const positionsArray = []
while (i < arraysOfRowData.length) {
  const position = {
    symbol: symbolsArray[i],
    todaysGain: arraysOfRowData[i][0],
    totalGain: arraysOfRowData[i][1],
    currentValue: arraysOfRowData[i][2],
    percentOfPortfolio: arraysOfRowData[i][3],
    quantity: arraysOfRowData[i][4],
    costBasis: arraysOfRowData[i][5],
    fiftyTwoWeekRange: arraysOfRowData[i][6]
  }
  positionsArray.push(position)
  i += 1
}

console.log(positionsArray)

// TODO: create a JSON object based on row data

// console.log(`column names: ${columnNamesArray}`)
// console.log(`symbols: ${symbolsArray}`)

// const lastPricesArray = getSymbols(htmlString) 
// const todaysGainsArray = getSymbols(htmlString) 
// const totalGainsArray = getSymbols(htmlString) 
// const currentValuesArray = getSymbols(htmlString) 
// const percentsArray = getSymbols(htmlString) 
// const quantitiesArray = getSymbols(htmlString) 
// const costBasisArray = getSymbols(htmlString) 
// const fiftyTwoWeekRangeArray = getSymbols(htmlString) 
/* [
  'Symbol',
  'Last Price',
  "Today's Gain/Loss",
  'Total Gain/Loss',
  'Current Value',
  '%',
  'Quantity',
  'Cost Basis',
  '52-Week Range'
]
*/

// // TODO: try and get the below code to work (above should work already)
// // Get the HTML element containing the table data
// // const jsdom = require("jsdom");
// // const { table } = require('console');
// // const dom = new jsdom.JSDOM(htmlString);
// // const tableDataElement = dom.window.document.querySelector('.portfolio__tab-container');

// // Extract the table rows
// const tableRows = tableDataElement ? Array.from(tableDataElement.getElementsByTagName('tr')) : [];
// console.log("tableRows")

// console.log(tableDataElement.getElementsByTagName('tr').item())

// // Initialize an array to store the parsed data
// const positionsData = [];

// // Iterate through each table row
// for (const row of tableRows) {
//   // Extract the table cells from the row
//   const cells = Array.from(row.getElementsByTagName('td'));

//   // Extract the relevant data from the cells
//   const position = cells[0].innerText;
//   const symbol = cells[1].innerText;
//   const quantity = cells[2].innerText;
//   const price = cells[3].innerText;

//   // Create an object with the extracted data
//   const positionData = {
//     position,
//     symbol,
//     quantity,
//     price
//   };

//   // Push the object to the positionsData array
//   positionsData.push(positionData);
//   console.log(positionsData)
// }