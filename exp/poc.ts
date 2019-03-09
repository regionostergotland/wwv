import { Conveyor } from '../src/app/conveyor.service'

let conv = new Conveyor()

// check which platforms are available
let platforms = conv.getPlatforms();
console.log("available platforms: " + platforms);

// check which categories are available for first platform
let platform = platforms[0];
let categories = conv.getCategories(platform);
console.log("available categories for " + platform + ": " + categories);

// fetch data from first category
let category = categories[0];
conv.fetchData(platform, category, "0", "1");

// get list of fetched data points
let list = conv.getDataList(category);
console.log(list);
console.log(list.spec.dataTypes); // type specifications for point values
let points = list.getPoints();
console.log(points); // fetched data

// send data to ehr
conv.sendData();
