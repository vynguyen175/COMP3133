// Original version
// function greeter(person: string) {
//     return "Hello, " + person;
// }
// let user = "World";
// console.log(greeter(user));
// Rewritten using ES6 features: let, arrow function, template literals
var greeter = function (firstName, lastName) {
    return "Hello, ".concat(firstName, " ").concat(lastName);
};
var firstName = "John";
var lastName = "Doe";
console.log(greeter(firstName, lastName));
