// Backend web framework -- Express
const express = require('express')
// Allows to have environment variables -- dotenv
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./config/db')
const runRTScraper  = require('./dataPipes/rtDataPipe')
const runDayAheadScraper = require('./dataPipes/dayAheadDataPipe')
const schedule = require('node-schedule')
// const { testFunction, testIncrementTime } = require('./test')
const port = process.env.port || 5000

connectDB()


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Scrapes the real time data once every 5 mins
const rtRule = new schedule.RecurrenceRule()
rtRule.hour = new schedule.Range(1, 23, 1)
rtRule.minute = new schedule.Range(0, 59, parseInt(process.env.SCHEDULE_INTERVAL))

const rtScrapingJob = schedule.scheduleJob(rtRule, function() {
    runRTScraper()
})

// Runs the day ahead scraper at 10:15p PST or 12:25am Texas Time every day
// Begins the interval of running the real-time scraper at 10:25p PST or 12:25am Texas Time every 15 mins every day
const dayAheadRule = new schedule.RecurrenceRule()
dayAheadRule.hour=18
dayAheadRule.minute=58
dayAheadRule.tz = 'CST'

// Scrapes the day ahead data once every day at 12:45 Texas Time
const dayAheadScrapingJob = schedule.scheduleJob(dayAheadRule, function() {
    runDayAheadScraper()
})






// runDayAheadScraper()
// runRTScraper()






// const testRule = new schedule.RecurrenceRule()
// testRule.hour=11
// testRule.minute=18
// testRule.tz = 'PST'
// const testJob = schedule.scheduleJob(testRule, function() {
//     console.log("hello")
//     const testInterval = setInterval(() => testFunction(), 3000)
// })
// const myInterval = setInterval(apiCall, 300000)






app.listen(port, () => console.log(`Server started on port ${port}`))