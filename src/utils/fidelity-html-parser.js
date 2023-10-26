// generated from chatGCP 10/25/23

// get html as string
const fs = require('fs')
const path = require('path')
const htmlparser2 = require('htmlparser2')

function readHTMLFile(filePath) {
  try {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    return htmlContent;
  } catch (error) {
    console.error(`Error reading HTML file: ${error}`);
    return null;
  }
}
// Specify the path to your HTML file
const htmlFilePath = path.normalize(path.resolve(__dirname)+'/../../test/sample-data/fidelity-html.html')

// Read the HTML file and return its content
const htmlString = readHTMLFile(htmlFilePath);

// Get account Number (with the help of chatGCP):
let insideSpan = false;
let brokerageAccountNumber = '';
const searchText = 'Brokerage:'

const parser = new htmlparser2.Parser({
  onopentag(name, attribs) {
    if (name === 'span') {
      console.log('attrib: '+attribs)
      insideSpan = true;
    }
  },
  ontext(text) {
    if (insideSpan && text.indexOf(searchText) != -1) {
      console.log("text")
      brokerageAccountNumber = text.substring(text.indexOf(searchText)+searchText.length).trim();
      insideSpan = false; // Stop parsing after finding the Brokerage account number
    }
  },
}, { decodeEntities: true });

parser.write(htmlString);
parser.end();

console.log('Brokerage Account Number:', brokerageAccountNumber);


// // Get the HTML element containing the table data
// const tableDataElement = document.querySelector('.portfolio__tab-container');

// // Extract the table rows
// const tableRows = tableDataElement ? Array.from(tableDataElement.getElementsByTagName('tr')) : [];

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
// }

// console.log(positionsData)

// // Convert the positionsData array to a JSON string
// const positionsDataJSON = JSON.stringify(positionsData);