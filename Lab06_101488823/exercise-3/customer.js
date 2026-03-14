var Customer = /** @class */ (function () {
    function Customer(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    Customer.prototype.greeter = function () {
        return "Hello, ".concat(this.firstName, " ").concat(this.lastName);
    };
    return Customer;
}());
var customer = new Customer("John", "Doe");
console.log(customer.greeter());
