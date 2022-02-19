
const mysql = require("mysql");
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

/**
 * Calculate tax
 * @param {number} amount - Total amount
 * @param {number} tax - Tax percentage
 * @returns {string} - Total with a dollar sign
 */
function config () {
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

const connection = mysql.createPool(config());



module.exports = {
    /**
    * GET - Возвращает одного определенного пользователя
    * @param {object} res - все ресурсы плагина express
    * @param {object} req - полный ответ от сервера express
    * @returns {null} - Ничего не возвращает
    */
    'GET': (res, req) => {
        console.log("3 этап GET_ITEM USER Handler")
        //Распарсить данные
        console.log(req.query)
        const userData = JSON.parse(req.query.data)
        console.log(userData)
        //Формируем запрос
        const sql = `SELECT * FROM users WHERE users.login="${userData.login}" AND users.password="${userData.password}"`
        //console.log(sql)
        const requestMessage = {
            STATUS_CODE: 200,
            REQUEST_TEXT: `Пользователь найден`,
            LOGIN: userData.login
        }

        connection.query(
            sql,
                (err, result) => {
                    err ? res.send("Пользователь не найден") : res.send(JSON.stringify(requestMessage));
                }
        );
    },
    'GET_ALL': () => {
       
    },
    'EDIT': () => {
       
    },
    'ADD': () => {
       
    },
    'DEL': () => {
       
    }
}