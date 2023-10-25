export const dollarStringToNumber = (dollarAmount:string):number|null => {
    let number = null
    if (typeof dollarAmount === 'string') {
        number = Number(dollarAmount.replace('$', ''))
        if (Number.isNaN(number)) {
          console.log(`Error: could not convert string, ${dollarAmount} to a dollarAmount.`)
          return null
        }        
    }
    return number
}