export class Customer {
    private firstName: string;
    private lastName: string;
    private _age: number;

    constructor(firstName: string, lastName: string, age: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this._age = age;
    }

    greeter(): string {
        return `Hello, ${this.firstName} ${this.lastName}`;
    }

    GetAge(): void {
        console.log(`Age: ${this._age}`);
    }
}
