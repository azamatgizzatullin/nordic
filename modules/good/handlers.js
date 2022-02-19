
const mysql = require("mysql");
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const Files = require('../files/index')
const connection = require('../connect/index')


module.exports = {
    'GET': (res, req) => {
        console.log('3 Этап: GET_ITEM')
        console.log(req.query.id)
        //состовляем запрос в базу данных
        //const sql = `SELECT * FROM good WHERE id=${req.query.id}`;
        // 1 Вариант (Полное соединение) Новый модернизированный запрос. Пример - SELECT * FROM good  INNER JOIN comments ON good.COMMENTS_ID=comments.id WHERE good.ID=11
        //const sql = `SELECT * FROM good  INNER JOIN comments ON good.COMMENTS_ID=comments.id WHERE good.ID=${req.query.id}`
        // 2 Вариант (Левое соединение)
        // ДЗ - добавить 3 соединение с таблицей category 
        const sql = `SELECT * FROM good  LEFT JOIN comments ON good.COMMENTS_ID=comments.id WHERE good.ID=${req.query.id}`
        // Отправляем запрос в БД
        connection.query(
            sql,
            (err, result) => {
               console.log('SELECT RESULT')
               console.log(result)
               err ? res.send(err) : result.length != 0 && res.send(JSON.stringify(result));
            }
        );

    },
    'GET_BY_CATEGORY': (res, req) => {
        console.log('4 Этап: Роут get_list_by_category')
        console.log(req.query.category)
        const sql = `SELECT * FROM category INNER JOIN good ON good.CATEGORY_ID=${req.query.category} WHERE good.CATEGORY_ID=${req.query.category}`
       
         // ДЕЛАЕМ ЗАПРОС К БАЗЕ
         connection.query(
            sql,
            (err, result) => {
               err ? res.send(err) : res.send(JSON.stringify(result));
               //console.log(JSON.stringify(result))
            }
        );

    },
    'GET_ALL': (res, req) => {
        console.log('3 Этап: Роут get_all_good')
        
        /**
         * SELECT - получить
         * * - Все
         * FROM - из
         * good - название таблицы в базе данных
         */
        const sql = `SELECT * FROM good`;

        // ДЕЛАЕМ ЗАПРОС К БАЗЕ
        connection.query(
            sql,
            (err, result) => {
               err ? res.send(err) : res.send(JSON.stringify(result));
               //console.log(JSON.stringify(result))
            }
        );

    },
    'EDIT': (res, req) => {
        /**
         * Example
         * http://localhost:3000/upp_item_good?data={"ID": "1", "TITLE": "Куртка замшевая обновленная", "DISCR": "Хорошая замшевая куртка", "PRICE": "1000", "IMG": "путь к изображению", "CATEGORY_ID": "1"}
         */
        console.log('4 Этап: EDIT')
        console.log(req.query)
        // Получить данные из запроса (распарсить дату)
        const dataArray = JSON.parse(req.query.data)
        // Формируем SQL для запроса в БД
        const sql = `
            UPDATE good 
                SET
            ${dataArray.ID ? `ID = '${dataArray.ID}',` : ''}
            ${dataArray.TITLE ? `TITLE = '${dataArray.TITLE}',` : ''}
            ${dataArray.DISCR ? `DISCR = '${dataArray.DISCR}',` : ''}
            ${dataArray.PRICE ? `PRICE = '${dataArray.PRICE}',` : ''}
            ${dataArray.IMG ? `IMG = '${dataArray.IMG}',` : ''}
            ${dataArray.FILE_IMG ? `FILE_IMG = '${dataArray.FILE_IMG}',` : ''}
            ${dataArray.COMMENTS_ID ? `COMMENTS_ID = '${dataArray.COMMENTS_ID}',` : ''}
            ${dataArray.CATEGORY_ID ? `CATEGORY_ID = '${dataArray.CATEGORY_ID}'` : ''}
                WHERE
            ID='${dataArray.ID}'
        `
        console.log(sql)

        const requestMessage = {
            STATUS_CODE: 200,
            REQUEST_TEXT: `Товар с id ${dataArray.ID} успешно обновлен`,
            ID: dataArray.ID
        }

        connection.query(
            sql,
                (err, result) => {
                    err ? res.send(err) : res.send(JSON.stringify(requestMessage));
                }
        );

    },
    'ADD': (res, req) => {
        /**
         * Example
         * http://localhost:3000/add_item_good?data={"TITLE": "Зимняя куртка", "DISCR": "Хорошая зимняя куртка", "PRICE": "1000", "IMG": "путь к изображению", "CATEGORY_ID": "1"}
         */
        console.log('3 Этап: Роут add_good')
        // Преобразуем JSON данные из GET параметра data в массив JS
        console.log(req)
        const dataArray = JSON.parse(req.data)
        // Сгенерировать id через функцию uuid
        const id = uuidv4();
        // Формируем SQL для запроса в БД
        const sql = `INSERT INTO good 
        (ID, TITLE, DISCR, PRICE, IMG, COMMENTS_ID, CATEGORY_ID, FILE_IMG)
            VALUES
        ('${id}', '${dataArray.TITLE}', '${dataArray.DISCR}', '${dataArray.PRICE}', '${dataArray.IMG}', '', '${dataArray.CATEGORY_ID}', '${dataArray.FILE_IMG}')    
        `
        console.log(sql)
        const requestMessage = {
            STATUS_CODE: 200,
            REQUEST_TEXT: `Товар с id ${id} успешно добавлен`,
            ID: id
        }


        connection.query(
            sql,
                (err, result) => {
                    err ? res.send(err) : res.send(JSON.stringify(requestMessage));
                }
        );

    },
    'DEL': (res, req) => {

        /**
         * example
         * http://localhost:3000/del_item_good?id=[идентификатор товара]
        */

       console.log("ЭТАП DEL HANDLER")
       
       const id = req.query.id
       const sql = `SELECT * FROM good WHERE good.ID="${id}"`

       connection.query(
        sql,
        (err, result) => {
          if(err){

            res.send(err)

          }else{

            const files = new Files()
            files.del(
             result[0]['FILE_IMG'], 
             res
            )

            // Сформировать SQL запрос на удаление товара из БД по идентификатору
            const sql = `DELETE FROM good WHERE good.id="${req.query.id}"`
            const requestMessage = {
                STATUS_CODE: 200,
                REQUEST_TEXT: `Товар с id ${req.query.id} успешно удален`
            }
            console.log(sql)
            // ДЕЛАЕМ ЗАПРОС К БАЗЕ
            connection.query(
                sql,
                (err, result) => {
                    err ? res.send(err) : res.send(JSON.stringify(requestMessage));
                }
            );
        }      
    })
    
    }
}