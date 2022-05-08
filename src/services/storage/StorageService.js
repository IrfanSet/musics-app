const fs = require('fs');
const Pool = require('pg');

class StorageService {
    constructor(folder) {
        this._folder = folder;
        this._poll = new Pool;

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, {
                recursive: true
            });
        }
    }

    writeFile(file, meta) {
        const filename = +new Date() + meta.filename;
        const path = `${this._folder}/${filename}`;

        const fileStream = fs.createWriteStream(path);

        return new Promise((resolve, reject) => {
            fileStream.on('error', (error) => reject(error));
            file.pipe(fileStream);
            file.on('end', () => resolve(filename));
        });
    }

    saveUrl(id, url){
        const query = {
            text: 'update albums set cover = $1 where id = $2 returning id',
            values: [url, id]
        }

        const result = await t

    }
}
module.exports = StorageService;