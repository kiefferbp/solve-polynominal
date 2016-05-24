(function () {
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
            return -1*Math.pow(-x, 1/3); // use the identity (-x)^(1/3) = -x^(1/3) (for real numbers)
        }
    }

    // a helper function that determines if a number is approximately zero
    // we need such a function due to round-off errors
    Number.prototype.isApproximatelyZero = function () {
        return (Math.abs(this) < 1e-12);
    };

    // a helper function that returns the square root of x
    // x is either a real number or an object that represents the real and imaginary parts of x
    function squareRoot(n) {
        var r, x, y;
        var squareRoot1 = {};
        var squareRoot2 = {};

        if (typeof n === "number") {
            if (n >= 0) {
                return Math.pow(n, 1/2);
            } else {
                throw new RangeError("x must either be a positive and real or a complex number.");
            }
        } else if (n !== null && typeof n === "object") {
            r = squareRoot(square(n.realPart) + square(n.imaginaryPart));
            y = squareRoot((r - a)/2);
            x = b/(2*y);

            squareRoot1.realPart = x;
            squareRoot1.imaginaryPart = y;

            squareRoot2.realPart = -x;
            squareRoot2.imaginaryPart = -y;

            return [squareRoot1, squareRoot2];
        } else {
            throw new RangeError("x must either be a positive and real or a complex number.");
        }
    }

    // a helper function that solves the quadratic equation ax^2 + bx + c = 0
    function solveQuadratic(a, b, c) {
        var discriminant = Math.pow(b, 2) - 4*a*c;
        var solution1 = (-b + squareRoot(discriminant))/(2*a);
        var solution2 = (-b - squareRoot(discriminant))/(2*a);

        return [solution1, solution2];
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
            R = -1*g/2 + squareRoot(h);
            S = cubeRoot(R);
            T = -1*g/2 - squareRoot(h);
            U = cubeRoot(T);

            solution1.realPart = S + U - b/(3*a);
            solution1.imaginaryPart = 0;
            solution1.isReal = true;

            solution2.realPart = -1*(S + U)/2 - b/(3*a);
            solution2.imaginaryPart = (S - U)*squareRoot(3)/2;
            solution2.isReal = false;

            solution3.realPart = -1*(S + U)/2 - b/(3*a);
            solution3.imaginaryPart = (S - U)*squareRoot(3)/2;
            solution3.isReal = false;
        } else { // 3 real solutions
            if (f.isApproximatelyZero() && g.isApproximatelyZero() && h.isApproximatelyZero()) { // all solutions are equal
                solution1.realPart = solution2.realPart = solution3.realPart = Math.pow(d/a, 1/3);
                solution1.imaginaryPart = solution2.imaginaryPart = solution3.imaginaryPart = 0;
                solution1.isReal = solution2.isReal = solution3.isReal = true;
            } else { // unequal solutions
                i = squareRoot(square(g)/4 - h);
                j = cubeRoot(i);
                k = Math.acos(-1*g/(2*i));
                L = -1*j;
                M = Math.cos(k/3);
                N = squareRoot(3)*Math.sin(k/3);
                P = -1*b/(3*a);

                solution1.realPart = 2*j*Math.cos(k/3) - b/(3*a);
                solution1.imaginaryPart = 0;
                solution1.isReal = true;

                solution1.realPart = L*(M + N) + P;
                solution1.imaginaryPart = 0;
                solution1.isReal = true;

                solution1.realPart = L*(M - N) + P;
                solution1.imaginaryPart = 0;
                solution1.isReal = true;
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
        // normalize the coefficients
        a = 1;
        b = b/a;
        c = c/a;
        d = d/a;
        e = e/a;

        // intermediate calculations
        var f = c - 3*square(b)/8;
        var g = d + cube(b)/8 - b*c/2;
        var h = e - 3*fourthPower(b)/256 + square(b)*c/16 - b*d/4;

        // solve the resolvent cubic
        var resolventCubicSolutions = solveCubic(1, f/2, (square(f) - 4*h)/16, -1*square(g)/64);

        // more to come!
    }

    return false;
}());