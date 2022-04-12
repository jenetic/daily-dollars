// Note: Program counts the current day as one day.

// Converts day into int value, with  as the first date in dateRanges array
const daysFromSchoolStart = (firstDay, date) => {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate())) / 24 / 60 / 60 / 1000; 
}

// Takes list of normal date ranges and an empty list -> turns that empty list into a list of date ranges in int form
const daysFromSchoolStartList = (dateRanges, dateRangesInt) => {
    for (let i = 0; i < dateRanges.length; i++) {
        let row = [];
        row.push(daysFromSchoolStart(dateRanges[0][0], dateRanges[i][0])); // Start of range
        row.push(daysFromSchoolStart(dateRanges[0][0], dateRanges[i][1])); // End of range
        dateRangesInt.push(row);
    }
}

// Appends int school days to a list of school days
const schoolDaysListFromRangesInt = (dateRangesInt, schoolDaysList) => {
    for (let i = 0; i < dateRangesInt.length; i++){
        // Iternates through each day in within each range
        for (let j = dateRangesInt[i][0]; j <= dateRangesInt[i][1]; j++) {
            schoolDaysList.push(j);
        }
    }
}

// Format date into mm/dd/yyyy format (for display)
const dateFormat = (date) => {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

// Calculate dollars left based on how many days of school are left
const calculateDollars = () => {
    
    // Store user input as variable "dollars"
    let dollars = document.getElementById("dollars").value;
    
    // Check if user inputted a negative number or something that isn't a number    
    if (dollars == "" || dollars < 0 || !(!isNaN(dollars) && !isNaN(parseFloat(dollars)))) {
        alert("Error: 'Remaining dining dollars' must be a positive number.");
        return 1;
    }
    
    // Date ranges of school year
    const dateRanges = [
        // 2021
        [new Date(2021, 8, 21), new Date(2021, 11, 11)], // Winter break
        [new Date(2022, 0, 3), new Date(2022, 2, 19)], // Spring break
        [new Date(2022, 2, 28), new Date(2022, 5, 10)] 
    ];
    let firstDay = dateRanges[0][0];
    let lastDay = dateRanges[dateRanges.length - 1][1];
    
    // CHECK IF BREAKS ARE INCLUDED
    let includeWinterBreak = document.getElementById("includeWinterBreak").checked;
    let includeSpringBreak = document.getElementById("includeSpringBreak").checked;
    
    // If both include winter and spring break are checked, edit dateRanges array to remove breaks
    if (includeWinterBreak && includeSpringBreak) {
        dateRanges[0][1] = dateRanges[2][1];
        dateRanges.splice(1, 2);
    }
    // If just include winter break is checked, edit dateRanges array to remove winter break
    else if (includeWinterBreak) {
        dateRanges[0][1] = dateRanges[1][1];
        dateRanges.splice(1, 1);
    }
    // If just include spring break is checked, edit dateRanges array to remove spring break
    else if (includeSpringBreak) {
        dateRanges[1][1] = dateRanges[2][1];
        dateRanges.splice(2, 1);
    }

    // Make school days list from date ranges
    const dateRangesInt = [];
    const schoolDaysList = [];
    daysFromSchoolStartList(dateRanges, dateRangesInt);
    schoolDaysListFromRangesInt(dateRangesInt, schoolDaysList);

    let today = new Date();
    let todayUpdated = new Date();
    let todayInt = daysFromSchoolStart(firstDay, today); // "todayInt" is int version of "today"

    // RECONFIGURE CURRENT DAY
    // If current day is before first day of school, set todayInt to 1st day of school
    if (todayInt < 0) {
        todayInt = 0;
        todayUpdated = dateRanges[0][0]; // Date that corresponds with "todayInt". For calculating weekends
    }

    // If current day is after last day of school, send message that school is over for the current school year
    else if (todayInt > dateRangesInt[dateRangesInt.length - 1][1]) {
        alert("Error: Current day is after the end of the school year.");
        return 1;
    }

    // Because the days before 1st and after last day of school are taken care of, any day that isn't in the list has to be on a break
    let todayIndex = schoolDaysList.indexOf(todayInt);

    // If current day is during a break, sets current day to the first day of when school resumes
    if (todayIndex === -1) {
        // Find which break the current day is in and iterate through list of date ranges
        for (let i = 0; i < (dateRangesInt.length - 1); i++) {
            // if current day is between end day of a range and start day of next range (aka. during a break)
            if (todayInt > dateRangesInt[i][1] && todayInt < dateRangesInt[i+1][0]) {
                todayInt = dateRangesInt[i+1][0];
                todayIndex = schoolDaysList.indexOf(todayInt);
                todayUpdated = dateRanges[i+1][0];
                break;
            }
        }
    }

    // Finds number of school days left, including the current day
    let schoolDaysLeft = schoolDaysList.length - todayIndex;

    // EXCLUDE WEEKENDS
    if (document.getElementById("excludeWeekends").checked) {
        // Modifies dateRanges so it just has ranges of dates from today to end of school year, including any breaks
        for (let i = 0; i < dateRanges.length; i++) {
            // If current day is between a range
            if (todayUpdated.getTime() >= dateRanges[i][0].getTime() && todayUpdated.getTime() <= dateRanges[i][1].getTime()) {
                dateRanges[i][0] = today;
                dateRanges.splice(0, i);
                break;
            }
        }
        
        // Find number of weekends
        let weekendCounter = 0;
        for (let i = 0; i < dateRanges.length; i++) {
            let start = dateRanges[i][0];
            let end = dateRanges[i][1];
            let days = 1 + (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 24 / 60 / 60 / 1000; // Find number of days between date range (inclusive)
            let saturdays = Math.floor((start.getDay() + days) / 7);
            let weekends = (saturdays*2)  
            if (start.getDay() == 0) { weekends++; }
            if (end.getDay() == 6) { weekends--; }
            weekendCounter += weekends;
        }
        // Modify schoolDaysLeft to exclude weekends
        schoolDaysLeft -= weekendCounter;
    }

    // Exclude additional days
    let excludeDays = document.getElementById("excludeDays").value;
    if (!excludeDays) { excludeDays = 0; }

    if (excludeDays % 1 != 0 || excludeDays < 0) {
        alert("Error: 'Exclude additional days' must be a positive whole number.")
        return 1;
    }

    if (schoolDaysLeft - excludeDays <= 0) {
        alert("Error: Number of additional excluded days exceeds number of days left of school.");
        return 1;
    }

    // Round user input to 2 decimal places
    dollars = (Math.round((dollars) * 1e2)/1e2).toFixed(2);

    const result = "$" + (Math.round((dollars / (schoolDaysLeft - excludeDays)) * 1e2)/1e2).toFixed(2); //toFixed(2) adds extra 0s if the number has less than 2 decimal places

    // DISPLAYS RESULTS
    const resultsList = document.getElementsByClassName("results"); // getElementsByClasssNames returns an array
    for (let i = 0; i < resultsList.length; i++) {
        resultsList[i].style.display = "inline";
    }
    
    // Today is ___.
    document.getElementById("today").innerHTML = dateFormat(today);
     
    // There are ___ days left until the end of school, which is ___.
    document.getElementById("school-days-left").innerHTML = schoolDaysLeft - excludeDays + " day(s)";
    document.getElementById("last-day").innerHTML = dateFormat(lastDay);

    // If you have ___ left, you can spend ___ each day to have enough for the rest of the school year.
    document.getElementById("og-dollars").innerHTML = "$" + dollars + " left";
    document.getElementById("result-dollars").innerHTML = result + " each day";

    return 0;
}
  
// Prevents page from refreshing when user clicks submit
const form = document.getElementById("form");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

// Runs calculateDollars() when submit button is clicked
document.getElementById("submit").addEventListener("click", calculateDollars);