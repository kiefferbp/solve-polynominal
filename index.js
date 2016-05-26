var solvePolynominal = (function () {
    "use strict";

    // a helper function that returns the square of x
    function square(x) {
        return Math.pow(x, 2);
    }

    // a helper function that returns the cube of x
    function cube(x) {
        return Math.pow(x, 3);
    }

    // a helper function that returns x to the fourth power
    function fourthPower(x) {
        return Math.pow(x, 4);
    }

    // a helper function that returns the real cube root of x
    function cubeRoot(x) {
        if (x >= 0) {
            return Math.pow(x, 1/3);
        } else { // Math.pow attempts to compute a complex cube root for negative numbers
            return -Math.pow(-x, 1/3); // use the identity x^(1/3) = -(-x)^(1/3) (for real numbers)
        }
    }

    // a helper function that computes the complex conjugate of a number
    function complexConjugate(x) {
        if (typeof x === "number") {
            return x; // a real number is its own conjugate
        } else {
            return {
                realPart: x.realPart,
                imaginaryPart: -x.imaginaryPart
            };
        }
    }

    // a helper function that computes the complex modulous of a complex number
    function complexModulus(x) {
        if (typeof x === "number") {
            return Math.abs(x);
        } else {
            return squareRoot(square(x.realPart) + square(x.imaginaryPart));
        }
    }

    // a helper function that computes the sum of two complex numbers
    function complexSum(x, y) {
        if (typeof x === "number") {
            x = {realPart: x, imaginaryPart: 0};
        }

        if (typeof y === "number") {
            y = {realPart: y, imaginaryPart: 0};
        }

        return {
            realPart: x.realPart + y.realPart,
            imaginaryPart: x.imaginaryPart + y.imaginaryPart
        };
    }

    // a helper function that computes the difference of two complex numbers
    function complexDifference(x, y) {
        if (typeof x === "number") {
            x = {realPart: x, imaginaryPart: 0};
        }

        if (typeof y === "number") {
            y = {realPart: y, imaginaryPart: 0};
        }

        return {
            realPart: x.realPart - y.realPart,
            imaginaryPart: x.imaginaryPart - y.imaginaryPart
        };
    }

    // a helper function that computes the product of two complex numbers
    function complexProduct(x, y) {
        if (typeof x === "number") {
            x = {realPart: x, imaginaryPart: 0};
        }

        if (typeof y === "number") {
            y = {realPart: y, imaginaryPart: 0};
        }

        // (a + bi)(c + di) = ac - bd + (ad + bc)i
        var a = x.realPart;
        var b = x.imaginaryPart;
        var c = y.realPart;
        var d = y.imaginaryPart;

        return {realPart: (a*c - b*d), imaginaryPart: (a*d + b*c)};
    }

    // a helper function that divides two complex numbers
    function complexDivision(x, y) {
        if (typeof x === "number") {
            x = {realPart: x, imaginaryPart: 0};
        }

        if (typeof y === "number") {
            y = {realPart: y, imaginaryPart: 0};
        }

        // (a + bi)/(c + di) = (ac + bd)/(c^2 + d^2) + [(bc - ad)/(c^2 + d^2)]i
        var a = x.realPart;
        var b = x.imaginaryPart;
        var c = y.realPart;
        var d = y.imaginaryPart;

        return {realPart: (a*c + b*d)/(square(c) + square(d)), imaginaryPart: (b*c - a*d)/(square(c) + square(d))};
    }

    // a helper function that computes the non-negative integral power of a complex number
    function complexPower(x, pow) {
        if (typeof x === "number") {
            x = {realPart: x, imaginaryPart: 0};
        }

        if (pow === 0) {
            return {realPart: 1, imaginaryPart: 0};
        } else {
            return complexProduct(x, complexPower(x, pow - 1));
        }
    }

    // a helper function that returns the square root of n
    // n is either a real number or an object that represents the real and imaginary parts of n
    // in the case that n is complex, we return its principal square root
    function squareRoot(n) {
        var r, x, y;

        if (typeof n === "number") {
            if (n >= 0) {
                return Math.pow(n, 1/2);
            } else {
                throw new RangeError("x must either be a positive and real or a complex number.");
            }
        } else if (n !== null && typeof n === "object") {
            if (n.imaginaryPart.isApproximatelyZero()) { // real number in object form
                return {realPart: squareRoot(n.realPart), imaginaryPart: 0};
            } else { // complex number
                r = complexModulus(n);
                y = squareRoot((r - n.realPart)/2);
                x = n.imaginaryPart/(2*y);

                return {realPart: x, imaginaryPart: y};
            }
        } else {
            throw new RangeError("x must either be a positive and real or a complex number.");
        }
    }

    // a helper function that determines if a number is approximately zero
    // we need such a function due to round-off errors
    Number.prototype.isApproximatelyZero = function () {
        return (Math.abs(this) < 1e-12);
    };

    // we also need the same function for objects that represent complex numbers
    Object.prototype.isApproximatelyZero = function () {
        return (complexModulus(this) < 1e-12);
    }

    // a helper function that solves the quadratic equation ax^2 + bx + c = 0
    function solveQuadratic(a, b, c) {
        var discriminant = Math.pow(b, 2) - 4*a*c;
        var solution1 = {};
        var solution2 = {};
        var solutions = [solutions1, solutions2];

        if (discriminant >= 0) { // real solutions
            solution1.realPart = (-b + squareRoot(discriminant))/(2*a);
            solution1.imaginaryPart = 0;
            solution1.isReal = true;

            solution2.realPart = (-b - squareRoot(discriminant))/(2*a);
            solution2.imaginaryPart = 0;
            solution2.isReal = true;
        } else { // complex solutions
            solution1.realPart = -b/(2*a);
            solution1.imaginaryPart = squareRoot(discriminant)/(2*a);
            solution1.isReal = false;

            solution2.realPart = -b/(2*a);
            solution2.imaginaryPart = -squareRoot(discriminant)/(2*a);
            solution2.isReal = false;
        }

        // perform zero cleanup on the solutions
        solutions.forEach(function (solution, index) {
            if (solution.realPart.isApproximatelyZero()) {
                solutions[index].realPart = 0;
            }

            if (solution.imaginaryPart.isApproximatelyZero()) {
                solutions[index].imaginaryPart = 0;
            }
        });

        return solutions;
    }

    // a helper function that solves the cubic equation ax^3 + bx^2 + cx + d = 0
    // uses the method discribed at 1728.com
    function solveCubic(a, b, c, d) {
        // cubic solutions
        var solution1 = {};
        var solution2 = {};
        var solution3 = {};
        var solutions = [solution1, solution2, solution3];

        // for intermediate calculations
        var f, g, h, i, j, k, L, M, N, P, R, S, T, U;

        // intermediate calculations
        f = (3*c/a - square(b)/square(a))/3;
        g = (2*cube(b)/cube(a) - 9*b*c/square(a) + 27*d/a)/27;
        h = square(g)/4 + cube(f)/27;

        if (h > 0 && !h.isApproximatelyZero()) { // 1 real root, 2 complex roots
            R = -g/2 + squareRoot(h);
            S = cubeRoot(R);
            T = -g/2 - squareRoot(h);
            U = cubeRoot(T);

            solution1.realPart = S + U - b/(3*a);
            solution1.imaginaryPart = 0;
            solution1.isReal = true;

            solution2.realPart = -(S + U)/2 - b/(3*a);
            solution2.imaginaryPart = (S - U)*squareRoot(3)/2;
            solution2.isReal = false;

            solution3.realPart = -(S + U)/2 - b/(3*a);
            solution3.imaginaryPart = -(S - U)*squareRoot(3)/2;
            solution3.isReal = false;
        } else { // 3 real solutions
            if (f.isApproximatelyZero() && g.isApproximatelyZero() && h.isApproximatelyZero()) { // all solutions are equal
                solution1.realPart = solution2.realPart = solution3.realPart = cubeRoot(r/a);
                solution1.imaginaryPart = solution2.imaginaryPart = solution3.imaginaryPart = 0;
                solution1.isReal = solution2.isReal = solution3.isReal = true;
            } else { // unequal solutions
                i = squareRoot(square(g)/4 - h);
                j = cubeRoot(i);
                k = Math.acos(-g/(2*i));
                L = -j;
                M = Math.cos(k/3);
                N = squareRoot(3)*Math.sin(k/3);
                P = -b/(3*a);

                solution1.realPart = 2*j*Math.cos(k/3) - b/(3*a);
                solution1.imaginaryPart = 0;
                solution1.isReal = true;

                solution2.realPart = L*(M + N) + P;
                solution2.imaginaryPart = 0;
                solution2.isReal = true;

                solution3.realPart = L*(M - N) + P;
                solution3.imaginaryPart = 0;
                solution3.isReal = true;
            }
        }

        // perform zero cleanup on the solutions
        solutions.forEach(function (solution, index) {
            if (solution.realPart.isApproximatelyZero()) {
                solutions[index].realPart = 0;
            }

            if (solution.imaginaryPart.isApproximatelyZero()) {
                solutions[index].imaginaryPart = 0;
            }
        });

        return solutions;
    }

    // a helper function that solves the quartic equation ax^4 + bx^3 + cx^2 + dx + e = 0
    // uses the method discribed at 1728.com
    function solveQuartic(a, b, c, d, e) {
        // quartic solutions
        var solution1 = {};
        var solution2 = {};
        var solution3 = {};
        var solution4 = {};
        var solutions = [solution1, solution2, solution3, solution4];

        // for intermediate calculations
        var f, g, h, p, q, r, s, Y2, Y3;

        // normalize the coefficients
        b = b/a;
        c = c/a;
        d = d/a;
        e = e/a;
        a = 1;

        // intermediate calculations
        var f = c - 3*square(b)/8;
        var g = d + cube(b)/8 - b*c/2;
        var h = e - 3*fourthPower(b)/256 + square(b)*c/16 - b*d/4;

        // solve the resolvent cubic
        var resolventCubicSolutions = solveCubic(1, f/2, (square(f) - 4*h)/16, -square(g)/64);

        // Note: the source says to pick two roots of the resolvent cubic as follows:
        // 1) if all three roots are real, pick any two non-zero ones
        // 2) if there are two complex solutions, pick those (in this case, solutions 2 and 3 are complex)
        if (resolventCubicSolutions[1].isReal) { // three real roots
            resolventCubicSolutions.forEach(function (solution) {
                if (!solution.isApproximatelyZero() && Y2 !== undefined && Y3 === undefined) {
                    Y3 = solution;
                }

                if (!solution.isApproximatelyZero() && Y2 === undefined) {
                    Y2 = solution;
                }
            });
        } else { // one real, two complex roots
            Y2 = resolventCubicSolutions[1];
            Y3 = resolventCubicSolutions[2];
        }

        p = squareRoot(Y2);
        q = complexConjugate(p);
        s = b/(4*a);

        // if p and q are complex, they are conjugates of each other
        // consequently, pq is real and equal to the square of their moduli
        if (resolventCubicSolutions[1].isReal) { // three real roots (p and q are real)
            r = -g/(8 * p.realPart * q.realPart);
        } else { // p and q are complex
            r = -g/(8 * complexModulus(Y2));
        }

        // compute the solutions
        solution1.realPart = p.realPart + q.realPart + r - s;
        solution1.imaginaryPart = p.imaginaryPart + q.imaginaryPart;
        solution1.isReal = solution1.imaginaryPart.isApproximatelyZero();

        solution2.realPart = p.realPart - q.realPart - r - s;
        solution2.imaginaryPart = p.imaginaryPart - q.imaginaryPart;
        solution2.isReal = solution2.imaginaryPart.isApproximatelyZero();

        solution3.realPart = -p.realPart + q.realPart - r - s;
        solution3.imaginaryPart = -p.imaginaryPart + q.imaginaryPart;
        solution3.isReal = solution3.imaginaryPart.isApproximatelyZero();

        solution4.realPart = -p.realPart - q.realPart + r - s;
        solution4.imaginaryPart = -p.imaginaryPart - q.imaginaryPart;
        solution4.isReal = solution4.imaginaryPart.isApproximatelyZero();

        // perform zero cleanup on the solutions
        solutions.forEach(function (solution, index) {
            if (solution.realPart.isApproximatelyZero()) {
                solutions[index].realPart = 0;
            }

            if (solution.imaginaryPart.isApproximatelyZero()) {
                solutions[index].imaginaryPart = 0;
                solutions[index].isReal = true; // since we don't know if the solution is real in advance
            }
        });

        return solutions;
    }

    // a helper function that evaluates a polynomial at a given value
    // arguments:
    //      coefficients: an array of numbers that represent the polynominal coefficients in standard form
    //                    (e.g., 3x^2 + 4x + 7 has coefficients of [3, 4, 7])
    //          argument: the number to evaluate the polynominal at
    // returns:
    //      a number that represents the result of evaluating this polynominal at x = argument
    function evaluatePolynominal(coefficients, argument) {
        function evaluatePolynominalHelper(coefficients, argument, runningTotal) {
            var degree = coefficients.length - 1;
            var leadingCoefficient = coefficients.shift();

            if (degree === 0) { // constant polynominal
                return complexSum(runningTotal, leadingCoefficient);
            } else {
                // runningTotal += leadingCoefficient*Math.pow(argument, degree) but with complex numbers
                runningTotal = complexSum(runningTotal, complexProduct(leadingCoefficient, complexPower(argument, degree)));

                return evaluatePolynominalHelper(coefficients, argument, runningTotal);
            }
        }

        return evaluatePolynominalHelper(coefficients, argument, 0);
    }

    // a helper function that evaluates a polynomial's derivative at a given value
    // arguments:
    //      coefficients: an array of numbers that represent the polynominal coefficients in standard form
    //                    (e.g., 3x^2 + 4x + 7 has coefficients of [3, 4, 7])
    //          argument: the number to evaluate the polynominal at
    // returns:
    //      a number that represents the result of evaluating the derivative of this polynominal at x = argument
    function evaluateDerivative(coefficients, argument) {
        var derivativeCoefficients = [];
        var degree = coefficients.length - 1;
        var index;

        // compute the derivative
        for (index = degree; index >= 0; index -= 1) {
            derivativeCoefficients.push(complexProduct(index, coefficients[degree - index]));
        }

        return evaluatePolynominal(derivativeCoefficients, argument);
    }

    // a helper function that divides the polynominal given by coefficients by x - argument
    // note: we assume that x - argument divides the polynominal cleanly, and that the polynominal already has a leading coefficient of 1
    // this will return an array consisting of the quotient's coefficients
    function syntheticDivide(coefficients, argument) {
        var i;
        var quotient = [];
        var quotientDegree = coefficients.length - 2;

        // the first coefficient of the quotient is already 1
        quotient.push({realPart: 1, imaginaryPart: 0});

        // now compute the remaining coefficients
        for (i = 1; i <= quotientDegree; i += 1) {
            quotient[i] = complexSum(coefficients[i], complexProduct(quotient[i - 1], argument));
        }

        return quotient;
    }

    // a helper function that finds a zero of the polynominal with the given coefficients
    // if division by zero or divergence is detected, this function throws an exception
    function findZero(coefficients) {
        // constants
        var SOLUTION_PRECISION = 1e-10;
        var MAX_ATTEMPTS = 10000;

        var fPrimeAtCurrentGuess, i, subtrahend;
        var fAtCurrentGuess = Number.MAX_VALUE;
        var attemptCount = 0;
        var currentGuess = {realPart: Math.random(), imaginaryPart: Math.random()};

        if (coefficients[0].isApproximatelyZero()) { // the leading coefficient is zero
            return findZero(coefficients.slice(1));
        }

        if (coefficients[coefficients.length - 1].isApproximatelyZero()) { // the constant term is zero
            return {realPart: 0, imaginaryPart: 0}; // 0 is clearly a zero
        }

        // normalize the coefficients
        for (i = 1; i < coefficients.length; i += 1) {
            coefficients[i] = coefficients[i]/coefficients[0];
        }

        coefficients[0] = 1;

        // run Newton's method
        while (true) { // loop breaks when currentGuess yields the desired precision, division by zero occurs, or we do too many attempts
            // check for breaking conditions
            if (fAtCurrentGuess.isApproximatelyZero()) {
                break; // stop running Newton's method
            } else if (attemptCount >= MAX_ATTEMPTS) {
                throw new RangeError("Divergence detected.");
            } else {
                attemptCount += 1;
            }

            // compute subtrahend = f(x)/f'(x)
            fAtCurrentGuess = evaluatePolynominal(coefficients, currentGuess);
            fPrimeAtCurrentGuess = evaluateDerivative(coefficients, currentGuess);

            if (fPrimeAtCurrentGuess.isApproximatelyZero()) { // divison by zero
                throw new RangeError("Division by zero detected.");
            }

            subtrahend = complexDivision(fAtCurrentGuess, fPrimeAtCurrentGuess);
            currentGuess = complexDifference(currentGuess, subtrahend);
            fAtCurrentGuess = evaluatePolynominal(coefficients, currentGuess); // update f(x) again
        }

        // if we got to this point, we have a valid solution
        return currentGuess;
    }

    // a helper function that finds the zeroes of the polynominal with the given coefficients
    function solvePolynominal(coefficients) {
        var solutions = [];
        var numOfSolutions = coefficients.length - 1;
        var quotient, zero;

        try {
            // find a zero if possible
            zero = findZero(coefficients);
            solutions.push(zero);

            // factor out polynominal with this zero
            quotient = syntheticDivide(coefficient, zero);

            // get more solutions
            if (solutions.length < numOfSolutions) {
                return solutions.concat(solvePolynominal(quotient));
            } else {
                return solutions;
            }
        } catch (e) { // Newton's method failed
            return e.stack;
        }
    }

    return solvePolynominal;
}());
