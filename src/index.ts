import { Surreal } from './Surreal';

// let five = Surreal.formNumber(0.5);
// five = Surreal.multiply(five, five);

// console.log(five.toString());
// console.log(five.calcValue());
const g = Surreal.generate(5);
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());

// console.log(Math.E);
// TODO MAKE IT WORK WITH SEQUENCES
