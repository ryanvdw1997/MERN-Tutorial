const res = require('express/lib/response')
const {PythonShell} = require('python-shell')
const axios = require('axios')
const asyncHandler = require('express-async-handler')
const scraper = require('../scrapers/dayAheadScraper.js')
const ercotDAHubModel = require('../models/ercotDAHubModel')
const ercotDALZWestModel = require('../models/ercotDALZWestModel')
const utils = require('../Utils')

let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './backend/pythonScripts'
  }


const runDayAheadScraper = asyncHandler( async () => {
  var daHubData = {}
  var daLZWestData = {}
  var numTries = 0
  while ((utils.isEmpty(daHubData))|(utils.isEmpty(daLZWestData))) {
    const scrapedData = await scraper.accessDAPage()
    // If the run was successful but no new data was returned then exit
    if ((scrapedData === 1) || (numTries > 5)) {
      daHubData = {'price': []}
      daLZWestData = {'price': []}
      break
    }
    daHubData = scrapedData[0]
    daLZWestData = scrapedData[1]
    numTries++
    console.log(daHubData)
    console.log(daLZWestData)
  }
  // Create the models
  if (daHubData['price'].length != daLZWestData['price'].length) {
    throw new Error("Day Ahead Data is whack yo")
  }
  for (var i = 0; i < daHubData['price'].length; i++) {
    const newDAHub = await ercotDAHubModel.create({
      price: daHubData['price'][i],
      time: daHubData['time'][i],
      site_label: daHubData['siteLabel'][i]
    })
    const newDALZWest = await ercotDALZWestModel.create({
      price: daLZWestData['price'][i],
      time: daLZWestData['time'][i],
      site_label: daLZWestData['siteLabel'][i]
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



module.exports = runDayAheadScraper