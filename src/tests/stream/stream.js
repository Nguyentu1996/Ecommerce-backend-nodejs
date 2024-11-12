const fs = require('fs')

const readStream = () => {
    const readStream = fs.createReadStream('');
    const writeStream = fs.createWriteStream('');
    readStream.pipe(writeStream);
    writeStream.on('finish', () => {
        console.log(`finish stream`)
    })
}

module.exports = {
    readStream
}