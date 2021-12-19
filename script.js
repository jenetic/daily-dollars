// Converts day into int value, with 1 as the first date in dateRanages array
function daysFromSchoolStart(date, dateRanges){
    var schoolStart = dateRanges[0][0];
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(schoolStart.getFullYear(), schoolStart.getMonth(), schoolStart.getDate())) / 24 / 60 / 60 / 1000; 
}

// Takes in list of normal date ranges and empty list, and turns it into a list of date ranges in integer form
function daysIntoYearList(dateRanges, dateRangesInt) {
    // Iterates through each date range
    for (let i = 0; i < dateRanges.length; i++) {
        const row = [];
        row.push(daysFromSchoolStart(dateRanges[i][0], dateRanges)); // Start of range
        row.push(daysFromSchoolStart(dateRanges[i][1], dateRanges)); // End of range
        dateRangesInt.push(row);
    }
}
// Empty array to store date ranges as integers
const dateRanges2021Int = [];

// Array of date ranges in Date object format
const dateRanges2021 = [
    [new Date(2021, 8, 21), new Date(2021, 10, 10)],
    [new Date(2021, 10, 12), new Date(2021, 10, 24)],
    [new Date(2021, 10, 29), new Date(2021, 11, 11)],
    [new Date(2022, 0, 3), new Date(2022, 0, 16)],
    [new Date(2022, 0, 18), new Date(2022, 1, 20)],
    [new Date(2022, 1, 22), new Date(2022, 2, 19)],
    [new Date(2022, 2, 28), new Date(2022, 4, 29)],
    [new Date(2022, 4, 31), new Date(2022, 5, 10)]
];
daysIntoYearList(dateRanges2021, dateRanges2021Int);
// console.log(dateRanges2021Int);

// Make list of school days
const schoolDaysList = [];

// Function that appends school days to the list of school days
function schoolDaysFromDateRanges(schoolDaysList, dateRangesInt) {
    // Iterates through each range
    for (let i = 0; i < dateRangesInt.length; i++) {
        // Iternates through each day in within each range
        for (let j = dateRangesInt[i][0]; j <= dateRangesInt[i][1]; j++) {
            schoolDaysList.push(j);
        }
    }
}
schoolDaysFromDateRanges(schoolDaysList, dateRanges2021Int);
console.log(schoolDaysList)


function calculateDollars() {
    var dollars = document.getElementById("dollars").value;
    
    // Check if user inputted a number
    var regex = /^[0-9]+$/;
    if (!dollars.match(regex)) {
        alert("Error: Must input a number.");
        return 1;
    }
    
    // Divide dollars by the number of days left in school
    var currentDay = daysIntoYear(new Date(2022, 8, 20));
    var currentDayIndex = schoolDaysList.indexOf(currentDay);
    
    // If current day is in the summer (assuming summer before the date ranges)
    // If current day is larger than the end of the school year and smaller than the first day of school
    if (currentDay > schoolDaysList[schoolDaysList.length - 1] && currentDay < schoolDaysList[0]) {
        curentDay = schoolDaysList[0];
    } 
    // If current day is on a break but between 1st and last day of school
    else if (currentDayIndex === -1) {


    }
    
}

// var testDollars = 100;
// var currentDay = daysIntoYear(new Date());
// var currentDayIndex = schoolDaysList.indexOf(currentDay);