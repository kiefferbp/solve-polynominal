(function () {
    "use strict";

    class ComplexNumber {
        constructor(realPart, imagPart) {
            this.realPart = realPart;
            this.imagPart = imagPart;
        }

        // returns the complex conjugate of this complex number
        getConjugate() {
            return new ComplexNumber(this.realPart, -this.imagPart);
        }

        // returns the modulus of this complex number
        getModulus() {
            return Math.sqrt(Math.pow(this.realPart, 2) + Math.pow(this.imagPart, 2));
        }

        // returns true if this complex number is approximately zero, and false otherwise
        isApproximatelyZero() {
            return (this.getModulus() < 1e-12);
        }

        // adds |other| to this complex number and returns the result
        add(other) {
            const resultRealPart = this.realPart + other.realPart;
            const resultImagPart = this.imagPart + other.imagPart;

            return new ComplexNumber(resultRealPart, resultImagPart);
        }

        // subtracts |other| from this complex number and returns the result
        subtract(other) {
            const resultRealPart = this.realPart - other.realPart;
            const resultImagPart = this.imagPart - other.imagPart;

            return new ComplexNumber(resultRealPart, resultImagPart);
        }

        // multiplies this with |other| and returns the result
        multiply(other) {
            const a = this.realPart;
            const b = this.imagPart;
            const c = other.realPart;
            const d = other.imagPart;

            // (a + bi)(c + di) = ac - bd + (ad + bc)i
            return new ComplexNumber(a*c - b*d, a*d + b*c);
        }

        divide(other) {
            const a = this.realPart;
            const b = this.imagPart;
            const c = other.realPart;
            const d = other.imagPart;

            // (a + bi)/(c + di) = (ac + bd)/(c^2 + d^2) + [(bc - ad)/(c^2 + d^2)]i
            const resultRealPart = (a*c + b*d)/(c*c + d*d);
            const resultImagPart = (b*c - a*d)/(c*c + d*d);

            return new ComplexNumber(resultRealPart, resultImagPart);
        }

        // computes |this|^|pow| for an integer pow and returns the result
        raiseToPower(pow) {
            if (!Number.isInteger(pow)) {
                throw new Exception("pow must be an integer");
            }

            // divide by the reciprocal
            if (pow < 0) {
                const complexOne = new ComplexNumber(1, 0);
                return complexOne.divide(this).raiseToPower(-pow);
            }

            // exploit the fact that x^n = (x^2)^(n/2)
            if (pow % 2 === 0) {
                const thisSquared = this.multiply(this);
                return thisSquared.raiseToPower(pow / 2);
            }

            return this.multiply(this).raiseToPower(pow - 1);
        }

        getPrincipalSqrt() {
            if (this.imaginaryPart.isApproximatelyZero()) {
                const part = Math.sqrt(Math.abs(this.realPart));

                if (this.realPart >= 0) {
                    return new ComplexNumber(part, 0);
                }

                return new ComplexNumber(0, part);
            }

            // at this point, we can assume that |this| is complex
            // note: y is well-defined since r >= this.realPart by construction
            const r = this.getModulus();
            const y = Math.sqrt((r - this.realPart)/2, 1/2);
            const x = this.imaginaryPart/(2 * y);

            return new ComplexNumber(x, y);
        }
    }

    // for now
    window.ComplexNumber = ComplexNumber;
}());
