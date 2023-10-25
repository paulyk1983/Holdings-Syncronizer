// Get account Number:
const htmlCode = "" // get this from fidelity-html.html
const parser = new DOMParser();
const doc = parser.parseFromString(htmlCode, "text/html")
const accountNumberElement = doc.querySelector(".portfolio__tab-container .new-tab-root[aria-current='true'] .new-tab__text-wrapper.tab-label") as any
const accountNumber = accountNumberElement ? accountNumberElement.innerText.trim() : ""
console.log(accountNumber)


// Get the HTML element containing the table data
const tableDataElement = document.querySelector('.portfolio__tab-container');

// Extract the table rows
const tableRows = tableDataElement ? Array.from(tableDataElement.getElementsByTagName('tr')) : [];

// Initialize an array to store the parsed data
const positionsData = [];

// Iterate through each table row
for (const row of tableRows) {
  // Extract the table cells from the row
  const cells = Array.from(row.getElementsByTagName('td'));

  // Extract the relevant data from the cells
  const position = cells[0].innerText;
  const symbol = cells[1].innerText;
  const quantity = cells[2].innerText;
  const price = cells[3].innerText;

  // Create an object with the extracted data
  const positionData = {
    position,
    symbol,
    quantity,
    price
  };

  // Push the object to the positionsData array
  positionsData.push(positionData);
}

console.log(positionsData)

// Convert the positionsData array to a JSON string
const positionsDataJSON = JSON.stringify(positionsData);