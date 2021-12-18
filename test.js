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

function daysFromSchoolStart(date, dateRanges){
    schoolStart = dateRanges[0][0];
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(schoolStart.getFullYear(), schoolStart.getMonth(), schoolStart.getDate())) / 24 / 60 / 60 / 1000; 
}

var date = new Date();
console.log(daysFromSchoolStart(date, dateRanges2021));