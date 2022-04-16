function isEmpty(obj) {
    if (!obj) {
        return true
    }
    return Object.keys(obj).length === 0;
}



function isAfter(inputTime, expectedTime, expectedDay, inputDay) {
    splitInput = inputTime.split(":")
    splitExpected = expectedTime.split(":")
    // Hour = split time [0]
    // Minute = split time [1]
    // If the hour of the inputTime is greater than the hour of the expected Time than it's after
    if ((expectedDay[0].localeCompare(inputDay[0]) != 0) || (expectedDay[1] != inputDay[1])) {
        console.log("This case is getting hit")
        console.log(expectedDay)
        console.log(inputDay)
        return false
    } else if (parseInt(splitInput[0]) > parseInt(splitExpected[0])) {
        return true
    } else if ((parseInt(splitInput[0]) === parseInt(splitExpected[0])) && (parseInt(splitInput[1]) > parseInt(splitExpected[1]))) {
        return true
    } else {
        return false
    }
    // if (parseInt(splitInput[0]) > parseInt(splitExpected[0])) {
    //     return true
    // } else if ((parseInt(splitInput[0]) === parseInt(splitExpected[0])) && (parseInt(splitInput[1]) >= parseInt(splitExpected[1]))) {
    //     return true
    // } else {
    //     return false
    // }
}

function addHours(date, hoursToAdd) {
    date.setHours(date.getHours()+hoursToAdd)
    return date
}



module.exports = { isAfter, isEmpty, addHours }