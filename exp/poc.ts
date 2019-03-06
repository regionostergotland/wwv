import { Conveyor } from '../src/app/conveyor.service'

let conv = new Conveyor()
let platforms = conv.getPlatforms();
console.log("available platforms: " + platforms);

let platform = platforms[0];
let categories = conv.getCategories(platform);
console.log("available categories for " + platform + ": " + categories);
let category = categories[0];

conv.fetchData(platform, category, "0", "1");
let data = conv.getData(category);
console.log(data);

data.states[0].input = "standing";
//conv.setData(category, data); // changes by reference above

conv.sendData();
