const puppet = require('puppeteer')
const express = require('express')
const { addHours } = require('../Utils')
// const asyncHandler = require('express-async-handler')

// function checkPrices(priceMatches) {
//     let price
//     for (var j = 0; j < priceMatches.length; j++) {
//         if (priceMatches[j].length === 5) {
//             price = priceMatches[j]
//             break
//         }
//     }
//     return price
// }
const months = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}

const accessDAPage = async () => {
    console.log("Day Ahead Scraper Activated " + Date.now.toString())
    const browser = await puppet.launch({ headless:true }).catch(() => null);
    console.log("browser launched")
    const page = await browser.newPage().catch(() => null);
    console.log("page opened")
    await page.goto('https://www.ercot.com/gridmktinfo/dashboards/systemwideprices/').catch(() => null);
    console.log("page accessed")
    await page.select("#systemWidePricesData", "lzWest").catch(() => null)
    const targetElems = await page.$$eval(".highcharts-point", el => el.map(x => x.getAttribute("aria-label"))).catch(() => null)
    if (targetElems === null) {
        console.log("Day ahead elements were null for this run. Try again.")
        return [{}, {}]
    }
    var successfulRun = 0
    const today = addHours(new Date(), 2)
    const expectedDay = [months[today.getMonth()+1],  today.getDate()]
    var dayAheadHub = {'price': [], 'time': [], 'siteLabel': []}
    var dayAheadLZWest = {'price': [], 'time': [], 'siteLabel': []}
    const priceRegex = "[0-9]{1,}\\.[0-9]*"
    console.log(targetElems.length)
    for (var i = 0; i < targetElems.length; i++) {
        if (targetElems[i].includes("Day-Ahead Hub")) {
            splitElem = targetElems[i].split(",")
            // Extracting all date information from the aria-label
            time = splitElem[2].trim()
            price = parseFloat(Array.from(splitElem[3].match(priceRegex))[0])
            date = splitElem[1].trim().split(" ")
            console.log(date)
            console.log(expectedDay)
            successfulRun = 1
            if ((date[0].localeCompare(expectedDay[0]) === 0) && (parseInt(date[1]) === expectedDay[1])) {
                dayAheadHub['time'].push(time)
                dayAheadHub['price'].push(price)
                dayAheadHub['siteLabel'].push(targetElems[i])
            } else if (i === targetElems.length-1) {
                dayAheadHub['time'].push(time)
                dayAheadHub['price'].push(price)
                dayAheadHub['siteLabel'].push(targetElems[i])
            } else {
                continue
            }
        } else if (targetElems[i].includes("Day-Ahead LZ")) {
            splitElem = targetElems[i].split(",")
            // Extracting all date information from the aria-label
            time = splitElem[2].trim()
            price = parseFloat(Array.from(splitElem[3].match(priceRegex))[0])
            date = splitElem[1].trim().split(" ")
            successfulRun = 1
            if ((date[0].localeCompare(expectedDay[0]) === 0) && (parseInt(date[1]) === expectedDay[1])) {
                dayAheadLZWest['time'].push(time)
                dayAheadLZWest['price'].push(price)
                dayAheadLZWest['siteLabel'].push(targetElems[i])
            } else if (i === targetElems.length-1) {
                dayAheadLZWest['time'].push(time)
                dayAheadLZWest['price'].push(price)
                dayAheadLZWest['siteLabel'].push(targetElems[i])
            } else {
                continue
            }
        }
    }
    await browser.close()
    if (successfulRun === 0) {
        return [{},{}]
    } else if ((dayAheadHub['price'].length === 0) || (dayAheadLZWest['price'].length === 0)) {
        console.log("No data collected")
        return 1
    } else {
        return [dayAheadHub, dayAheadLZWest]
    }
  }

module.exports = { accessDAPage }