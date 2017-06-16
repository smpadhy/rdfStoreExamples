const circle = require('./../ttest/circle.js');
const greetings = require('./../greetings.js')
console.log(`The area of a circle of radius 4 is ${circle.area(2)}`);
global.num = 3;
console.log(greetings.sayHelloInEnglish())
console.log(greetings.sayHelloInSpanish())
