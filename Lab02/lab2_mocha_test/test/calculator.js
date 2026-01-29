const chai = require('chai');
const expect = chai.expect;
const calculator = require('../app/calculator');

describe('Calculator Tests', function() {

    // Addition Tests
    describe('add()', function() {
        it('should return 7 when adding 5 and 2', function() {
            const result = calculator.add(5, 2);
            expect(result).to.equal(7);
        });

        it('should return 8 when adding 5 and 2 (expected to fail)', function() {
            const result = calculator.add(5, 2);
            expect(result).to.equal(8);
        });
    });

    // Subtraction Tests
    describe('sub()', function() {
        it('should return 3 when subtracting 2 from 5', function() {
            const result = calculator.sub(5, 2);
            expect(result).to.equal(3);
        });

        it('should return 5 when subtracting 2 from 5 (expected to fail)', function() {
            const result = calculator.sub(5, 2);
            expect(result).to.equal(5);
        });
    });

    // Multiplication Tests
    describe('mul()', function() {
        it('should return 10 when multiplying 5 and 2', function() {
            const result = calculator.mul(5, 2);
            expect(result).to.equal(10);
        });

        it('should return 12 when multiplying 5 and 2 (expected to fail)', function() {
            const result = calculator.mul(5, 2);
            expect(result).to.equal(12);
        });
    });

    // Division Tests
    describe('div()', function() {
        it('should return 5 when dividing 10 by 2', function() {
            const result = calculator.div(10, 2);
            expect(result).to.equal(5);
        });

        it('should return 2 when dividing 10 by 2 (expected to fail)', function() {
            const result = calculator.div(10, 2);
            expect(result).to.equal(2);
        });
    });
});
   