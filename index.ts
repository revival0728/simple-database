import { Request, Response } from 'express'
const express = require('express')
const fs = require('fs')
const sr = require('simple-random')
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// User Configuration
const max_admin_try = 5
const backup_interval = 5000    // seconds
var block_all_requests = false


// database variables
var database: {[index: string]:any} = {
        data: [],
        attrs_list: {}
    }
const DATABASE_ESSENTAIL_KEY = ['data', 'attrs_list']
var admin_password = sr()
var now_admin_try = 0


// database functions
const checkDataBaseHealth = (): boolean => {
    let check_result = true
    DATABASE_ESSENTAIL_KEY.forEach((cur) => {
        if(!(cur in database)) {
            check_result = false
            return
        }
    })
    return check_result
}

const initDatabase = (): void => {
    database = {
        'data': [],
        'attrs_list': {}
    }
}

const readByIndex = (index: number): object[] => {
    return [database['data'][index]]
}

const readByAttrs = (attrs: string): object[] => {
    let query_result: object[] = []
    database['attrs_list'][attrs].forEach((cur: number) => {
        query_result.push(database['data'][cur])
    })
    return query_result
}

const writeData = (data: object): void => {
    let now_data_index = database['data'].length
    Object.keys(data).forEach((key) => {
        if(key in database['attrs_list']) {
            database['attrs_list'][key].push(now_data_index)
        } else {
            database['attrs_list'][key] = [now_data_index]
        }
    })
    database['data'].push(data)
}

const setBackupTimer = () => {
    setInterval(() => {
        fs.writeFileSync('./data/database.json', JSON.stringify(database))
    }, backup_interval)
}


// Express App functions

/*
* The function for reading datas from database
*
* req.body = {
*   readByIndex: number,
*   readByAttrs: string,
* }
*/
app.post('/read', (req: Request, res: Response) => {
    if(block_all_requests) {
        res.status(200).json({error: `Request is automatically blocked`})
        return
    }
    let config = req.body
    if(config === null || config === undefined) {
        res.status(200).json({error: `Request Body not found`})
        return
    }
    if('readByIndex' in config) {
        if(typeof config['readByIndex'] !== 'number') {
            res.status(200).json({error: `In req.body: readByIndex must be a number`})
            return
        }
        if(database['data'].length <= config['readByIndex']) {
            res.status(200).json({error: `Index out of range`})
            return
        }
        res.status(200).json({data: readByIndex(config['readByIndex'])})
        return
    }
    if('readByAttrs' in config) {
        if(typeof config['readByAttrs'] !== 'string') {
            res.status(200).json({error: `In req.body: readByAttrs must be a string`})
            return
        }
        if(database['attrs_list'][config['readByAttrs']] === undefined) {
            res.status(200).json({error: `Attributions not found`})
            return
        }
        res.status(200).json({data: readByAttrs(config['readByAttrs'])})
        return
    }
    res.status(200).json({error: `In app/read/: POST method error`})
    return 
})

/*
* The function for writing datas to database
*
* req.body = {
*   data: {
*       ...
*   }
* }
*/
app.post('/write', (req: Request, res: Response) => {
    if(block_all_requests) {
        res.status(200).json({error: `Request is automatically blocked`})
        return
    }
    let config = req.body
    if(config === null || config === undefined) {
        res.status(200).json({error: `Request Body not found`})
        return
    }
    if(!('data' in config)) {
        res.status(200).json({error: `In req.body: data not found`})
        return
    }
    writeData(config['data'])
    res.status(200).json({success: true})
    return
})

/*
* The function for initializing database
*
* req.body = {
*   admin_password: string
* }
*/
app.post('/init', (req: Request, res: Response) => {
    if(block_all_requests) {
        res.status(200).json({error: `Request is automatically blocked`})
        return
    }
    let config = req.body
    if(config === null || config === undefined) {
        res.status(200).json({error: `Request Failed`})
        return
    }
    if(config['admin_password'] !== admin_password) {
        now_admin_try += 1
        if(now_admin_try >= max_admin_try) {
            block_all_requests = true
            console.log(`Info: To protect the database, now all requests will be blocked.`)
        }
        res.status(200).json({error: `Request Failed`})
        console.log(`Warning: Admin Try Count: ${now_admin_try}/${max_admin_try}`)
        return
    } else {
        now_admin_try = 0
        initDatabase()
        admin_password = sr()
        console.log(`Info: Successfully initialized the database`)
        console.log(`Info: Changed Admin Password -> admin_password = ${admin_password}`)
        res.status(200).json({success: true})
        return
    }
})


// Start Express App (Database)
app.listen(port, () => {
    if(!checkDataBaseHealth()) {
        console.log('Something went wrong in database')
    }
    console.log(`Info: admin_password = ${admin_password}`)
    now_admin_try = 0
})
