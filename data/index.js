const fs = require('fs')

const init_database = {
    data: [],
    attrs: {}
}

if(!fs.existsSync('./data/database.json')) {
    fs.writeFile('./data/database.json', JSON.stringify(init_database), (err) => {
        if(err) console.log(err)
        console.log(`Successfully generated ./data/database.json`)
    })
} else {
    console.log(`Already generated ./data/database.json`)
}
