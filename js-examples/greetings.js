// greetings.js

/*exports.sayHelloInEnglish=()=> {
  let h = "hello "
  for(let i=1; i<=num; i++){
    h = h + "hello "
  }
    return h
}

exports.sayHelloInSpanish=()=>{
  return "Hola"
}*/
var names={}
var _sayHelloInEnglish = function() {
  let h = "hello "
  for(let i=1; i<=num; i++){
    h = h + "hello "
  }
  h = h + _sayHelloInSpanish()
  return h
}

var _sayHelloInSpanish = function(){
  names['smruti'] = 'smruti'
  console.log("names:", names['smruti'])
  return "Hola"
}

var Point = class Point{
  constructor(x,y){
    this.x = x
    this.y = y
  }
  sum(){
    return this.x + this.y
  }
  display(){
    console.log("sum:",this.sum())
    }
}

module.exports = {
  sayHelloInEnglish : _sayHelloInEnglish,
  sayHelloInSpanish : _sayHelloInSpanish,
  Point : Point
}
