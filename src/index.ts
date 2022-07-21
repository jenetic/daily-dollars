import './style.css';

// Note: Program counts the current day as one day.

// Converts day into int value, with  as the first date in dateRanges array
const daysFromSchoolStart = (firstDay: Date, date: Date): number => {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - 
            Date.UTC(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate())) 
            / 24 / 60 / 60 / 1000; 
}

// Takes list of normal date ranges and an empty list -> turns that empty list into a list of date ranges in int form
const daysFromSchoolStartList = (dateRanges: Date[][], dateRangesInt: number[][]): void => {
    for (let i = 0; i < dateRanges.length; i++) {
        let row: number[] = [];
        row.push(daysFromSchoolStart(dateRanges[0][0], dateRanges[i][0])); // Start of range
        row.push(daysFromSchoolStart(dateRanges[0][0], dateRanges[i][1])); // End of range
        dateRangesInt.push(row);
    }
}

// Appends int school days to a list of school days
const schoolDaysListFromRangesInt = (dateRangesInt: number[][], schoolDaysList: number[]): void => {
    for (let i = 0; i < dateRangesInt.length; i++){
        // Iternates through each day in within each range
        for (let j = dateRangesInt[i][0]; j <= dateRangesInt[i][1]; j++) {
            schoolDaysList.push(j);
        }
    }
}

// Format date into mm/dd/yyyy format (for display)
const dateFormat = (date: Date): string => {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

// Calculate dollars left based on how many days of school are left
const calculateDollars = (): void => {
    
    // Store user input as variable "dollars"
    let dollarsElement: string | null = (<HTMLInputElement>document.getElementById("dollars")).value;
    let dollars: number | null = parseFloat(dollarsElement);
    
    // Check if user inputted a negative number or something that isn't a number    
    if (isNaN(dollars) || dollars < 0) {
        document.getElementById("error")!.textContent = "Error: 'Remaining dining dollars' must be a positive number.";
        document.getElementById("results")!.style.display = "none";;
        return;
    }
    
    // Date ranges of school year
    const dateRanges: Date[][] = [
        // 2022
        // TODO: fix mechanics involving the first day 
        [new Date(2022, 5, 19), new Date(2022, 11, 10)], // Winter break
        [new Date(2023, 0, 4), new Date(2023, 2, 25)], // Spring break
        [new Date(2023, 3, 3), new Date(2023, 5, 16)] 
    ];
    let firstDay = dateRanges[0][0];
    let lastDay = dateRanges[dateRanges.length - 1][1];
    
    // CHECK IF BREAKS ARE INCLUDED
    let includeWinterBreak: boolean = (<HTMLInputElement>document.getElementById("includeWinterBreak")).checked;
    let includeSpringBreak: boolean = (<HTMLInputElement>document.getElementById("includeSpringBreak")).checked;
    
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
    const dateRangesInt: number[][] = [];
    const schoolDaysList: number[] = [];
    daysFromSchoolStartList(dateRanges, dateRangesInt);
    schoolDaysListFromRangesInt(dateRangesInt, schoolDaysList);

    let today = new Date();
    let todayUpdated = new Date();
    let todayInt: number = daysFromSchoolStart(firstDay, today); // "todayInt" is int version of "today"

    // RECONFIGURE CURRENT DAY
    // If current day is before first day of school, set todayInt to 1st day of school
    if (todayInt < 0) {
        todayInt = 0;
        todayUpdated = dateRanges[0][0]; // Date that corresponds with "todayInt". For calculating weekends
    }

    // If current day is after last day of school, send message that school is over for the current school year
    else if (todayInt > dateRangesInt[dateRangesInt.length - 1][1]) {
        document.getElementById("error")!.textContent = "Error: Current day is after the end of the school year.";
        document.getElementById("results")!.style.display = "none";
        return;
    }

    // Because the days before 1st and after last day of school are taken care of, any day that isn't in the list has to be on a break
    let todayIndex: number = schoolDaysList.indexOf(todayInt);

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
    let schoolDaysLeft: number = schoolDaysList.length - todayIndex;

    // EXCLUDE WEEKENDS
    if ((<HTMLInputElement>document.getElementById("excludeWeekends")).checked) {
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
    let excludeDaysElement: string | null = (<HTMLInputElement>document.getElementById("excludeDays")).value;
    if (!excludeDaysElement) { excludeDaysElement = String(0); }

    let excludeDays: number = parseFloat(excludeDaysElement);

    if (excludeDays % 1 != 0 || excludeDays < 0) {
        document.getElementById("error")!.textContent = "Error: 'Exclude additional days' must be a positive whole number.";
        document.getElementById("results")!.style.display = "none";
        return;
    }

    if (schoolDaysLeft - excludeDays <= 0) {
        document.getElementById("error")!.textContent = "Error: Number of additional excluded days exceeds number of days left of school.";
        document.getElementById("results")!.style.display = "none";
        return;
    }

    // Round user input to 2 decimal places & turn back into number type
    dollarsElement = (Math.round((dollars) * 1e2)/1e2).toFixed(2);
    dollars = parseFloat(dollarsElement);

    const result = "$" + (Math.round((dollars / (schoolDaysLeft - excludeDays)) * 1e2)/1e2).toFixed(2); //toFixed(2) adds extra 0s if the number has less than 2 decimal places

    // DISPLAYS RESULTS
    document.getElementById("error")!.textContent = "";

    document.getElementById("results")!.style.display = "inline";

    // Today is ___.
    document.getElementById("today")!.innerHTML = dateFormat(today);
     
    // There are ___ days left until the end of school, which is ___.
    document.getElementById("school-days-left")!.innerHTML = schoolDaysLeft - excludeDays + " day(s)";
    document.getElementById("last-day")!.innerHTML = dateFormat(lastDay);

    // If you have ___ left, you can spend ___ each day to have enough for the rest of the school year.
    document.getElementById("og-dollars")!.innerHTML = "$" + dollarsElement + " left";
    document.getElementById("result-dollars")!.innerHTML = result + " each day";
}
  
// Prevents page from refreshing when user clicks submit
const form: HTMLElement = <HTMLInputElement>document.getElementById("form");
function handleForm(event: Event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

// Runs calculateDollars() when submit button is clicked
document.getElementById("submit")!.addEventListener("click", calculateDollars);