var wknd = true;

const dateRanges = [
    // 2021
    [new Date(2021, 8, 21), new Date(2021, 11, 11)], // Winter break
    [new Date(2022, 0, 3), new Date(2022, 2, 19)], // Spring break
    [new Date(2022, 2, 28), new Date(2022, 5, 10)] 
];

var today = new Date(2022, 2, 29);

//  TO DO: If ignore weekends is checked
if (wknd) {
    // Changing dateRanges to calculate weekends. If this causes a problem, just change a copy of dateRanges
    // Changes first element in dateRanges to today, so dateRanges just has ranges of dates from today to end of school year
    for (let i = 0; i < dateRanges.length; i++) {
        // If current day is between a range
        if (today.getTime() >= dateRanges[i][0].getTime() && today.getTime() <= dateRanges[i][1].getTime()) {
            dateRanges[i][0] = today;
            dateRanges.splice(0, i);
            console.log("hji");
            break;
        }
    }

    // Find number of weekends
    var weekendCounter = 0;
    for (let i = 0; i < dateRanges.length; i++) {
        let start, end = dateRanges[i][0], ;
        let end = dateRanges[i][1];
        let days = 1 + (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 24 / 60 / 60 / 1000; // Find number of days between date range (inclusive)
        let saturdays = Math.floor((start.getDay() + days) / 7);
        let weekends = (saturdays*2)  
        if (start.getDay() == 0) {
            weekends++;
        }
        if (end.getDay() == 6) {
            weekends--;
        }
        weekendCounter += weekends;
    }
}