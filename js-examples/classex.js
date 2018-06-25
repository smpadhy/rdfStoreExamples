var Point = class Point {
  constructor(x,y){
    this.x = x
    this.y = y
  }
  sum(){
    return this.x + this.y
  }
  toString() {
        return `(${this.x}, ${this.y})`;
    }
}
module.exports = {Point: Point}
