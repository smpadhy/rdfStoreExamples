const circle = require('./../ttest/circle.js');
const greetings = require('./../js-examples/greetings.js')
//const pc = require('./../js-examples/classex.js')
//import Point from pc
console.log(`The area of a circle of radius 4 is ${circle.area(2)}`);
global.num = 3;
console.log(greetings.sayHelloInEnglish())
console.log(greetings.sayHelloInSpanish())

var t = new greetings.Point(5,6)
//console.log("sum = ", t.sum())
t.display()
console.log("x value = ", t.x)
