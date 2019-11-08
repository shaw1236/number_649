// Purpose: Collect the numbers and show top used 7 numbers
// Author : Simon Li
// Date   : Nov 11, 2019
//
// Usage : 
// const number_649 = require('number_649');
// const number649 = new number_649();

"use strict";

const csvfile = require('csvfile');

class number_649 {
    constructor() {
        this.numberPool = {};
    }

    // Add a number to the pool
    add(num, usage = 1) {
        if (typeof(num) === "string" && isNaN(num))
            throw new Error(`${num} is not a numeric string!`);
        else if (typeof(num) != 'number')
            throw new Error(`${num} is not a numeric string or number!`);
        
        const key = num.toString();    
        if (this.numberPool.hasOwnProperty(key))
            this.numberPool[key] += usage;
        else
            this.numberPool[key] = usage;    
    }

    // Generates number between two numbers low (inclusive) and high (exclusive)
    static generateNumber(low = 1, high = 50) {
        return Math.floor(low + Math.random() * (high - low)); 
    }

    // Display the number pool
    list() {
        console.log(this.numberPool);
    }

    // Return a sortable array
    getSortArray() {
        const sortable = []; // {"1": 10, "49": 5}
        for (const key in this.numberPool) 
            sortable.push([Number(key), this.numberPool[key]]);
        
        sortable.sort((a, b) => b[1] - a[1]);  // Descending
        return sortable;
    }

    // Pick up top N
    top(num = 7) {
        const sortable = this.getSortArray();
        const sizeOfNumber = Math.min(num, sortable.length);
 
        console.log("=====================");
        console.log("Number <= Frequence");
        console.log("=====================");
        for (var idx = 0; idx < sizeOfNumber; idx++) {
            console.log((sortable[idx][0] + " ").substring(0, 2) + " <= " + sortable[idx][1]);
        }
    }

    // Display random numbers
    static random(size = 1000) {
        const number649 = new number_649();

        for (var idx = 1; idx <= size; idx++)
            number649.add(number_649.generateNumber()); 
    
        number649.top();
    }

    static processFile(file, delimiter = ',', heading = true, callback) {
        const number649 = new number_649();
        csvfile.read(file, delimiter, heading, rows => {
            rows.forEach(row => {
                //console.log(row);
                Object.values(row).forEach(elem => {
                    if (!isNaN(elem))
                        number649.add(Number(elem));
                })
            })  

            if (typeof(callback) != 'undefined')
                callback(number649);
            else    
                number649.top();
        })
    }

    static processExcelFile(file, callback) {
        const number649 = new number_649();
        
        // `rows` is an array of rows
        // each row being an array of cells.
        csvfile.readExcelA(file).then(rows => {
            rows.forEach(row => {
                row.forEach(cell => {
                    if (cell !== null && !isNaN(cell))
                        number649.add(Number(cell));
                })
            })

            if (typeof(callback) != 'undefined')
                callback(number649);
            else    
                number649.top();
        });
    }
}

module.exports = number_649;

if (require.main === module) {
    //console.log('called directly');
    number_649.random(2000);
    number_649.processFile('../testnumber.txt', undefined, false);
    number_649.processExcelFile('C:/Users/shaw1/Downloads/649 Winning Numbers.xlsx');
}