var Customer = /** @class */ (function () {
    function Customer() {
    }
    Customer.prototype.greeter = function () {
        return "Hello, ".concat(this.firstName, " ").concat(this.lastName);
    };
    return Customer;
}());
var customer = new Customer();
customer.firstName = "John";
customer.lastName = "Doe";
console.log(customer.greeter());
