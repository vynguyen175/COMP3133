class Customer {
    private firstName: string;
    private lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    greeter(): string {
        return `Hello, ${this.firstName} ${this.lastName}`;
    }
}

let customer = new Customer("John", "Doe");
console.log(customer.greeter());
