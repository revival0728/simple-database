# simple-database
---
A simple and lightweight database

## Download
You can download from the release sources

Or just clone the repository

```
git clone https://github.com/revival0728/simple-database.git
```

## First Use
Run the following command
```
npm install --production
npm run install
```

## Start the application
Run the following command
```
npm run start
```

## Usage
### Read from database
Make a post request to `~/read/`

#### readByIndex
Set `req.body` as following
```json
{
    readByIndex: the_index_of_data (number)
}
```
returns as the following format
```json
{
    data: [singe_data]
}
```

#### readByAttrs
Set `req.body` as following
```json
{
    readByAttrs: the_attributes_of_data (string)
}
```
returns as the following format
```json
{
    data: [...]
}
```

### Write to database
Make a post request to `~/write/` and set `req.body` as following
```json
{
    data: {
        ...
    }
}
```
returns as the following format
```json
{
    success: true
}
```

### Initialize the database
Make a post request to `~/init/` and set `req.body` as following
```json
{
    admin_password: the_auto_generated_random_admin_password
}
```
returns as the following format
```json
{
    success: true
}
```

## Request Error
If the request failed, the api will return as the following format
```json
{
    error: "some messages"
}
```

## Security
The only security function is protecting from initializing the whole database

So just use it in local network

### Initializing the whole database
There will be a automatic generated random admin password printed in the console

Everytime you Successfully initialized it or restart the whole application

The admin password will be refreshed

The maximum try is configured in the `~/index.js` (`~/index.ts`)

If someone tries the wrong password continuously, the database will block all requests until you restart the whole application
