const fs = require('fs')

const clear_database = {
    data: [],
    attrs_list: {}
}

if(!fs.existsSync('./data/database.json')) {
    fs.writeFile('./data/database.json', JSON.stringify(clear_database), (err) => {
        if(err) console.log(err)
        console.log(`Successfully generated ./data/database.json`)
    })
} else {
    console.log(`Already generated ./data/database.json`)
}
