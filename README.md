# solve-polynominal
A polynominal equation solver written in JavaScript. This repository is under construction.

# How to install and use
To use the `solve-polynominal` package in a node.js project, run following command:

    npm install solve-polynominal

Then, you can just `require` it as follows:

    var solve = require('solve-polynominal');

# About
This npm module is an extension of my polynominal calculators I have done in the past (I'll link them later).

# Examples
You can invoke `solve-polynominal` either asynchronously or synchronously. Here are some synchronous examples:

    console.log(solve("x^2 + 5x + 6 = 0")); // [-3, -2]
    console.log(solve("10x^2 - 28x + 16 = 0")); // [2, 0.8]
    console.log(solve("10x^2 - 28x + 16 = 0", {useFractions: true})); // [2, "4/5"]
    console.log(solve("3x^3 - 10x^2 + 14x + 27 = 0", {decimalPlaces: 3})); // [-1, "2.167 + 2.075i", "2.167 - 2.075i"]
    
It is recommended to use `solve-polynominal` asynchronously to solve polynominals of higher order (degrees 5 or more), where computations are heavy and work should ideally be offloaded. Here are some asynchronous examples.

    // logs the following after a heavy computation session:
    // "Solution #1: -1.2153" 
    // "Solution #2: -0.9475 - 0.7726i"
    // "Solution #3: -0.9475 + 0.7726i"
    // "Solution #4: -0.2392 - 1.2155i"
    // "Solution #5: -0.2392 + 1.2155i"
    // "Solution #6: 0.6098 - 1.0962i"
    // "Solution #7: 0.6098 + 1.0962i"
    // "Solution #8: 1.1845 - 0.4391i"
    // "Solution #9: 1.1845 + 0.4391i"
    solve("x^9 + x + 7 = 0", {decimalPlaces: 4}, function (solutions) {
        solutions.forEach(function (solution, index)) {
            console.log("Solution #" + (index + 1) + ": " + solution);
        });
    });
    
    // logs the following after a heavy computation session:
    // "Real solution: -1.2153"
    solve("x^9 + x + 7 = 0", {
        decimalPlaces: 4, 
        realOnly: true
    }, function (solution) {
        console.log("Real solution #: " + solution);
    });
    

    
