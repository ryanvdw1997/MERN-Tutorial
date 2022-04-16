const puppet = require('puppeteer')
const express = require('express')
const { isAfter, addHours } = require('../Utils')
const ercotRTHub = require('../models/ercotRTHubModel')
const ercotRTLZWest = require('../models/ercotRTLZWestModel')
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

const accessRTPage = async () => {
    const browser = await puppet.launch({ headless:true }).catch(() => null);
    console.log("browser launched")
    const page = await browser.newPage().catch(() => null);
    console.log("page opened")
    await page.goto('https://www.ercot.com/gridmktinfo/dashboards/systemwideprices/').catch(() => null);
    console.log("page accessed")
    await page.select("#systemWidePricesData", "lzWest").catch(() => null)
    var successfulRun = 0
    const today = addHours(new Date(), 2)
    const expectedDay = [months[today.getMonth()+1], today.getDate()]
    var rtHub = {'price': [], 'time': [], 'siteLabel': []}
    var rtLZWest = {'price': [], 'time': [], 'siteLabel': []}
    const priceRegex = "[0-9]{1,}\\.[0-9]*"
    const targetElems = await page.$$eval(".highcharts-point", el => el.map(x => x.getAttribute("aria-label"))).catch(() => null)
    if (targetElems === null) {
        console.log("Target Elements were null on this run. Try again.")
        return [{}, {}]
    }
    // Loop through each element and get the data points that we don't have yet
    latestHubRecord = await (await ercotRTHub.find().sort({ 'createdAt': -1}).limit(1).select('time')).at(0)
    latestLZRecord = await (await ercotRTLZWest.find().sort({ 'createdAt': -1 }).limit(1).select('time')).at(0)
    latestHub = latestHubRecord === null ? null : latestHubRecord['time']
    latestLZ = latestLZRecord === null ? null : latestLZRecord['time']
    console.log(latestLZ)
    console.log(latestHub)
    for (var i = 0; i < targetElems.length; i++) {
        let price
        let time
        if (targetElems[i].includes("Real-Time Hub")) {
            successfulRun = 1
            splitElem = targetElems[i].split(",")
            time = splitElem[2].trim()
            date = splitElem[1].trim().split(" ")
            if (splitElem[3] != null) {
                price = parseFloat(Array.from(splitElem[3].match(priceRegex))[0])
            } else {
                continue
            }
            if ((latestHub === null) || (isAfter(time, latestHub, expectedDay, [date[0], parseInt(date[1])]))) {
                rtHub['time'].push(time)
                rtHub['price'].push(price)
                rtHub['siteLabel'].push(targetElems[i])
            } else {
                continue
            }
        } else if (targetElems[i].includes("Real-Time LZ")) {
            successfulRun = 1
            splitElem = targetElems[i].split(",")
            time = splitElem[2].trim()
            if (splitElem[3] != null) {
                price = parseFloat(Array.from(splitElem[3].match(priceRegex))[0])
            } else {
                continue
            }
            if ((latestLZ === null) || (isAfter(time, latestLZ, expectedDay, [date[0], parseInt(date[1])]))) {
                rtLZWest['time'].push(time)
                rtLZWest['price'].push(price)
                rtLZWest['siteLabel'].push(targetElems[i])
            } else {
                continue
            }
        }
    }
    // If we don't collect any new data on this run then return 1
    // If we do, then increment the expected time appropriately
    if (successfulRun === 0) {
        return [{}, {}]
    } else if ((rtLZWest['price'].length === 0) || (rtHub['price'].length === 0)) {
        return 1
    }
    await browser.close()
    // for (var j = 0; j < rtLZWest['price'].length; j++) {
    //     if (expectedMin === 60-parseInt(process.env.SCRAPING_INTERVAL)) {
    //         expectedMin = 0
    //         if (expectedHour === 23) {
    //             expectedHour = 00
    //         } else {
    //             expectedHour++
    //         }
    //     } else {
    //         expectedMin+=parseInt(process.env.SCRAPING_INTERVAL)
    //     }
    // }
    // console.log(expectedMin, expectedHour)

    return [rtHub, rtLZWest]
    
  }


module.exports = { accessRTPage }