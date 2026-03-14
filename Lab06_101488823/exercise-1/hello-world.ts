// Original version
// function greeter(person: string) {
//     return "Hello, " + person;
// }
// let user = "World";
// console.log(greeter(user));

// Rewritten using ES6 features: let, arrow function, template literals
let greeter = (firstName: string, lastName: string): string => {
    return `Hello, ${firstName} ${lastName}`;
};

let firstName: string = "John";
let lastName: string = "Doe";
console.log(greeter(firstName, lastName));
