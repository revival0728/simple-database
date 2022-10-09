const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const URL = 'http://localhost:3001'

const test_1 = async () => {
    let req_body = {
        readByIndex: 0
    }
    let res = await fetch(`${URL}/read/`, {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {'Content-Type': 'application/json'}
    })
    let data = await res.json()
    console.log(data)
}

const test_2 = async () => {
    let req_body = {
        data: {
            username: 'revival0728',
            passwd: '12345'
        }
    }
    let res = await fetch(`${URL}/write/`, {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {'Content-Type': 'application/json'}
    })
    let data = await res.json()
    console.log(data)
}

const test_3 = async () => {
    let req_body = {
        readByAttrs: 'username'
    }
    let res = await fetch(`${URL}/read/`, {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {'Content-Type': 'application/json'}
    })
    let data = await res.json()
    console.log(data)
}

const test_4 = async () => {
    let req_body = {
        admin_password: 'wengOb8T4mNKGkPh'
    }
    let res = await fetch(`${URL}/init/`, {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {'Content-Type': 'application/json'}
    })
    let data = await res.json()
    console.log(data)
}

const test_units = [test_2, test_1, test_3]

const run_tests = async () => {
    test_units.forEach((cur, index) => {
        console.log(`Running Test #${index}`)
        cur()
    })
}

run_tests()
