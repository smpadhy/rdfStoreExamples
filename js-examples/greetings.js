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

var _sayHelloInEnglish = function() {
  let h = "hello "
  for(let i=1; i<=num; i++){
    h = h + "hello "
  }
  h = h + _sayHelloInSpanish()
  return h
}

var _sayHelloInSpanish = function(){
  return "Hola"
}

module.exports = {
  sayHelloInEnglish : _sayHelloInEnglish,
  sayHelloInSpanish : _sayHelloInSpanish
}
