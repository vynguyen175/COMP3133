class Customer {
    firstName: string;
    lastName: string;

    greeter(): string {
        return `Hello, ${this.firstName} ${this.lastName}`;
    }
}

let customer = new Customer();
customer.firstName = "John";
customer.lastName = "Doe";
console.log(customer.greeter());
