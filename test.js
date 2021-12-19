dollars = "18.9d";
console.log(!(!isNaN(dollars) && !isNaN(parseFloat(dollars))));
return 0;

if ((dollars%1) != 0){
    console.log("bruhhh");
    return 1;
}
console.log("ok");
return 0;