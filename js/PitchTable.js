// Equal-tempered pitch table generator function
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

function createPitchTable(A4Freq) {
    let table = [];
    for (let c = 0; c < 9 * 12; c++) {
        table.push(0);
    }

    table[4 * 12 + 9] = A4Freq;
    let i = 4 * 12 + 10;
    while (i < 9 * 12) {
        if (i % 12 == 9) {
            table[i] = table[i - 12] * 2;
        } else {
            table[i] = table[i - 1] * Math.pow(2, 1 / 12);
        }
        i++;
    }

    i = 4 * 12 + 8;
    while (i >= 0) {
        if (i % 12 == 2) {
            table[i] = table[i + 12] / 2;
        } else {
            table[i] = table[i + 1] / Math.pow(2, 1 / 12);
        }
        i--;
    }

    return table;
}