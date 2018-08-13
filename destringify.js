const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

if (!argv.in || !argv.out) {
    console.info('Usage: node destringify --in=path/to/data.json --out=path/to/output.json');
    return;
}

const data = require(argv.in);
let c = 0;

function destringify(obj) {
    if (typeof obj === 'string') {
        try {
            return eval(obj);
        } catch (e) {
            return obj;
        }
    } else if (Array.isArray(obj)) {
        return obj.map(item => destringify(item));
    } else {
        const finalObj = {};
        Object.keys(obj).forEach((key) => {
            finalObj[key] = destringify(obj[key]);
        });

        return finalObj;
    }
}

const outputData = destringify(data);

fs.writeFileSync(argv.out, JSON.stringify(outputData));