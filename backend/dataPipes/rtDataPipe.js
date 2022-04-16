const res = require('express/lib/response')
const {PythonShell} = require('python-shell')
const axios = require('axios')
const asyncHandler = require('express-async-handler')
const scraper = require('../scrapers/rtDataScraper')
const ercotRTHubModel = require('../models/ercotRTHubModel')
const ercotRTLZWestModel = require('../models/ercotRTLZWestModel')
const utils = require('../Utils')

let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './backend/pythonScripts'
  }


// Make the web API call
const runRTScraper = asyncHandler( async () => {
  var rtHubData = {}
  var rtLZWestData = {}
  var numTries = 0
  console.log("Real-Time Scraper Activated " + Date.now.toString())
  while ((utils.isEmpty(rtHubData))|(utils.isEmpty(rtLZWestData))) {
    const scrapedData = await scraper.accessRTPage()
    console.log(scrapedData)
    if ((scrapedData === 1) || (numTries > 5)) {
      rtHubData = {'price': []}
      rtLZWestData = {'price': []}
      break
    }
    numTries++
    rtHubData = scrapedData[0]
    rtLZWestData = scrapedData[1]
    console.log(rtHubData)
    console.log(rtLZWestData)
  }

  // Create the models
  for (var i = 0; i < rtHubData['price'].length; i++) {
    const newRTHub = await ercotRTHubModel.create({
      price: rtHubData['price'][i],
      time: rtHubData['time'][i],
      site_label: rtHubData['siteLabel'][i],
      tries: numTries
    })
  }
  
  for (var i = 0; i < rtLZWestData['price'].length; i++) {
    const newRTLZWest = await ercotRTLZWestModel.create({
      price: rtLZWestData['price'][i],
      time: rtLZWestData['time'][i],
      site_label: rtLZWestData['siteLabel'][i],
      tries: numTries
    })
  }
    // Passing all of our data through to the python script as a json object
    // if (process.env.DATA_COLLECTION === 0) {
    //     console.log("Python script is getting the call")
    //     const allBCData = await Bitcoin.find(newBCDataPt.id).lean()
    //     const jsonBCData = JSON.stringify(allBCData)
    //     options['args'] = [jsonBCData]

    //     PythonShell.run('dataToss.py', options, function (err, results) {
    //         if (err) throw err;
    //         // results is an array consisting of messages collected during execution
    //         console.log('results: %j', results);
    //     });
})



module.exports = runRTScraper