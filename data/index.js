const fs = require('fs')

const init_database = {
    data: [],
    attrs: {}
}

fs.writeFile('./database.json', JSON.stringify(init_database))
