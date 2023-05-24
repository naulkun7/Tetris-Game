// export default class Undo {
//   constructor(d) {
//     this.data = d;
//     this.next = null;
//   }
//   constructor() {
//     this.top = null;
//   }

//   isEmpty() {
//     return this.top === null;
//   }

//   push(val) {
//     let link = new link(val);
//     link.next = this.top;
//     this.top = link;
//   }

//   pop() {
//     this.top = this.top.next;
//   }

//   peek() {
//     if (!this.isEmpty())
//       return this.top.data;

//     return 'm';
//   }
// }
// class Link1 {
//   constructor(d) {
//     this.data = d;
//     this.next = null;
//   }
// }

// class Undo {
//   constructor() {
//     this.top = null;
//   }

//   isEmpty() {
//     return this.top == null;
//   }

//   push(val) {
//     let link = new Link1(val);
//     link.next = this.top;
//     this.top = link;
//   }

//   pop() {
//     this.top = this.top.next;
//   }

//   peek() {
//     if (!this.isEmpty())
//       return this.top.data;

//     return 'm';
//   }
// }
