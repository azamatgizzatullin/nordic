const myslq = require("mysql")
const {DB_NAME, LOGIN, PASSWORD, URL, NAME_EVENT} = require('./const')

class Connect{
    
    getConfig(){
        return {
          host: "94.228.125.221",
          port: 3306,
          user: 'inordic_shoop',
          password: 'inordic_shoop',
          database: 'inordic_shoop',
          connectionLimit : 1000,
          connectTimeout  : 60 * 60 * 1000,
          acquireTimeout  : 60 * 60 * 1000,
          timeout         : 60 * 60 * 1000
        }
    }
    getConnect(){
        const myslq = require("mysql")
        return myslq.createPool(this.getConfig())
    }
    constructor(){
        return this.getConnect()
    }
}

const connetion = new Connect()
module.exports = connetion