// Testing the use of global variables for a timed job
var clicks = 0

const testFunction = () => {
    console.log(clicks)
    clicks++
    return
}



module.exports = { testFunction, testIncrementTime }