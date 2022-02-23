//Импорт модулей внешних
const express = require('express');
var events = require('events');
const multerGood = require('multer')

//Импорт модулей внутренних
var moduleUser = require('./modules/user/index');
var moduleGood = require('./modules/good/index');
var moduleComments = require('./modules/comments/index');
var Files = require('./modules/files/index')
//Создаем объект для работы с файлом
const files = new Files()

// Настройки модулей
const app = express();
const eventEmitter = new events.EventEmitter();
const uploadGood = multerGood({ dest: 'uploads/' })
const typeAddGood = uploadGood.single('MYFILE')


app.get('/', function (req, res) {
  res.send('<h1>Hello SERVER</h1>');
});

// Роут для авторизации
app.get('/auth', function (req, res) {
  console.log("1 этап auth")
  moduleUser.INIT(eventEmitter, res, req)
  moduleUser.GET_ITEM(
    eventEmitter
  )
})

// Роут для регистрации
app.get('/reg', function (req, res) {
  moduleUser.ADD()
})

// Роут для получения всех пользователей
app.get('/get_all_user', function (req, res) {

})

// Роут для получения всех товаров
app.get('/get_all_good', function (req, res) {
  //req.query.action
  moduleGood.INIT(eventEmitter, res, req)
  console.log('1 Этап: Роут get_all_good')
  moduleGood.GET_ALL(
    eventEmitter
  )
})

// Роут для получения одного товара
app.get('/get_item_good', function (req, res) {
  moduleGood.INIT(eventEmitter, res, req)
  console.log('1 Этап: Роут get_item_good')
  console.log(req.query.id)
  moduleGood.GET_ITEM(
    eventEmitter
  )
})

// Роут для получения товаров по категории
app.get('/get_list_by_category', function (req, res) {
  console.log('1 Этап: Роут get_list_by_category')
  moduleGood.INIT(eventEmitter, res, req)
  moduleGood.GET_BY_CATEGORY(
    eventEmitter
  )
})

// Роут для удаления товара
app.get('/del_item_good', function (req, res) {
  moduleGood.INIT(eventEmitter, res, req)
  moduleGood.DEL_ITEM(eventEmitter)
})

// Роут для обновления товара  с помощью строки
app.get('/upp_item_good_string', function (req, res) {
  moduleGood.INIT(eventEmitter, res, req)
  moduleGood.EDIT(
    eventEmitter
  )
})

// Роут для обновления товара  с помощью формы
app.post('/upp_item_good_form', typeAddGood, function (req, res) {

  console.log(req.body)
  console.log(req.file)

  /**
   * Сначало добавляем файл, затем удаляем
  */

  if (req.file) {
    files.add(
      req.file
    )
    files.del(
      req.body.OLDFILE
    )
  }

  // Создаем ответа requestQuery
  const requestString = {
    query: {
      data: null
    }
  }
  const json = {
    ID: req.body.ID,
    TITLE: req.body.TITLE,
    DISCR: req.body.DISCR,
    PRICE: req.body.PRICE,
    IMG: req.body.IMG,
    COMMENTS_ID: req.body.COMMENTS_ID,
    CATEGORY_ID: req.body.CATEGORY_ID,
    FILE_IMG: req.file ? req.file.originalname : ''
  }

  requestString.query.data = JSON.stringify(json)

  moduleGood.INIT(eventEmitter, res, requestString)
  moduleGood.EDIT(
    eventEmitter
  )

})

// Роут для добавления товара с помощью строки, подходит для добавления товара, без файла (изображение как путь к картинке)
app.get('/add_item_good_string', function (req, res) {
  moduleGood.INIT(eventEmitter, res, req.query)
  moduleGood.ADD(
    eventEmitter
  )
})

// Роут для добавления товара с помощью формы
app.post('/add_item_good_form', typeAddGood, function (req, res) {

  //Добавляем через модуль
  req.file && files.add(
    req.file
  )

  // Создадим строку из данных для сохранения
  const requestString = {}
  const json = {
    TITLE: req.body.TITLE,
    DISCR: req.body.DISCR,
    PRICE: req.body.PRICE,
    IMG: req.body.IMG,
    COMMENTS_ID: req.body.COMMENTS_ID,
    CATEGORY_ID: req.body.CATEGORY_ID,
    FILE_IMG: req.file.originalname

  }

  requestString.data = JSON.stringify(json)

  moduleGood.INIT(eventEmitter, res, requestString)
  moduleGood.ADD(
    eventEmitter
  )

})

// Роут для совершения покупки
app.get('/buy', function (req, res) {

})

// Роут для получения базовык настроек приложения
app.get('/base_setting', function (req, res) {

})


/* КОММЕНТАРИИ */


// Роут для получения всех комментариев
app.get('/get_all_comments', function (req, res) {
  //req.query.action
  moduleComments.INIT(eventEmitter, res, req)
  console.log('1 Этап: Роут get_all_comments')
  moduleComments.GET_ALL(
    eventEmitter
  )
})
// Роут для получения комментариев о товаре
app.get('/back', function (req, res) {

})


// Инструменты для работы с АПИ напрямую
//Конект для форм
const connection = require('./modules/connect')

// Роут для добавления комментария с помощью формы
app.post('/add_comment_form', typeAddGood, function (req, res) {
  console.log('Данные с формы:');
 // console.log(req.body);
  //res.send(req);

  // Создадим строку из данных для сохранения комментария
  const requestString = {}
  const json = {
    id: req.body.COMMENT_ID,
    text: req.body.TEXT,
    user_id: req.body.USER_ID,
    time: req.body.TIME,
  }
  //добавляем комментарий
  requestString.data = JSON.stringify(json);
  moduleComments.INIT(eventEmitter, res, requestString)
  moduleComments.ADD(
    eventEmitter
  )
//Обновить товар
 // moduleGood.EDIT
 // req.body.GOOD_ID, вписать в COMMENTS_ID req.body.COMMENT_ID

})

//форма для оставления отзыва
app.get('/form_add_comment', function (req, res) {
  const sqlgoods = `SELECT * FROM good`;
  const sqlcomments = `SELECT * FROM comments`;
  let select = "";
  let feedbacks = "";
  //ВАЖНО
 let currentcommentIDS ="";
  connection.query(
    sqlgoods,
    (err, result) => {
      if (err) {
        res.send(err)
      } else {
        //запрос товаров успешен, записываем результат и запрашиваем комменты
        let select = "";
        //ВАЖНО
        //currentcommentIDS +=
        result.forEach((item, index) => {
          select += `<option value='${item['ID']}'>${item['TITLE']}</option>`
        })
        //запрашиваем все комментарии (для дебаггинга)
        connection.query(
          sqlcomments,
          (err, result) => {
            if (err) {
              res.send(err)
            } else {
              feedbacks = JSON.stringify(result)
              const {
                v4: uuidv4,
              } = require('uuid');
              let commentid = uuidv4();
              var today = new Date();
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              today = dd + '.' + mm + '.' + yyyy;

              // всё успешно, выдаём результат
              res.send(`
              <h1>Форма отызва</h1>
              <form enctype="multipart/form-data" method="post" action="/add_comment_form">
               <p>Выберите товар:</p>
               <select name='GOOD_ID'>${select}
                </select>
                <p>Оставьте отзыв:</p>
                <textarea name='TEXT'></textarea>
                <p>Метаданные:</p>
                <span>ID комментария:</span>
                <input type="text" value="${commentid}" name="COMMENT_ID" />
                <span>ID пользователя:</span>
                <input type="text" value="1" name="USER_ID" />
                <span>Дата:</span>
                <input type="text" value="${today}" name="TIME" />
                <input type='submit' value='Отправить'>
              </form>
              <div id="current_comments">${feedbacks}</div>
            `)
            }
          }
        );

      }
    }
  );



})


/* КОММЕНТАРИИ - конец */


// Форма для удаления товара
app.get('/form_del_item_good', function (req, res) {

  const sql = `SELECT * FROM good`;

  connection.query(
    sql,
    (err, result) => {
      if (err) {
        res.send(err)
      } else {

        let select = `<select name='id'>`

        result.forEach((item, index) => {
          select += `<option value='${item['ID']}'>${item['TITLE']}</option>`
        })
        select += `</select>`

        res.send(`
            <form method="GET" action="/del_item_good">
              ${select}
              <input type='submit' value='Удалить'>
            </form>
         `)

      }
    }
  );

})

// Форма для добавления товара
app.get('/form_add_item_good', function (req, res) {

  const sql = `SELECT * FROM category`;

  connection.query(
    sql,
    (err, result) => {
      if (err) {
        res.send(err)
      } else {

        let select = `<select name='CATEGORY_ID'>`

        result.forEach((item, index) => {
          console.log(item['title'])
          console.log(item['id'])
          select += `<option value='${item['id']}'>${item['title']}</option>`
        })
        select += `</select>`

        res.send(`
            <form enctype="multipart/form-data" method="POST" action="/add_item_good_form">
              <input type='text' placeholder='Название товара' name='TITLE'>
              <textarea name='DISCR'></textarea>
              <input type='number' name='PRICE'>
              <input type='text' name='IMG'>
              <input type='file' name='MYFILE'>
              ${select}
              <input type='submit' value='Отправить'>
            </form>
         `)

      }
    }
  );

})

// Форма для обновления товара
app.get('/form_edit_item_good', function (req, res) {

  const sql = `SELECT * FROM category`;
  const idGood = req.query.id

  !idGood && res.send(`Не указан ID товара`)

  connection.query(
    sql,
    (err, result) => {
      if (err) {
        res.send(err)
      } else {

        let select = `<select name='CATEGORY_ID'>`

        result.forEach((item, index) => {
          select += `<option value='${item['id']}'>${item['title']}</option>`
        })
        select += `</select>`

        const sql = `SELECT * FROM good WHERE id='${idGood}'`;
        connection.query(
          sql,
          (err, result) => {

            result.length == 0 && res.send(`Не найдет товар с ID = ${idGood}`)

            /**
             *  const linkDownLoad 
             *  Константа для скачивания файла на форме редактирования товара
             */
            const linkDownLoad =
              result[0].FILE_IMG
                ?
                `Установлено изображение товара: 
                <a href="/download?filename=${result[0].FILE_IMG}&&redirect=${idGood}">${result[0].FILE_IMG}</a>`
                : ''

            /**
             * Рисуем форму в методе res.send для редактирования товара
             */
            res.send(`
              <form enctype="multipart/form-data" method="POST" action="/upp_item_good_form">
                <input type='text' placeholder='Название товара' name='TITLE' value=${result[0].TITLE}>
                <textarea name='DISCR'>${result[0].DISCR}</textarea>
                <input type='number' value=${result[0].PRICE} name='PRICE'>
                <input type='text' value=${result[0].IMG} name='IMG'>
                ${linkDownLoad}
                <input type='file' name='MYFILE'>
                <input type='hidden' name='OLDFILE' value='${result[0].FILE_IMG}'>
                <input type='hidden' name='ID' value='${result[0].ID}'>
                ${select}
                <input type='submit' value='Отправить'>
              </form>
            `)
          })
      }
    }
  );

})

//Вспомогательные роуты

//Скачивание файла
app.get('/download', function (req, res) {
  res.download(`./uploads/${req.query.filename}`);
})

//Информация об операционной системе сервера
app.get('/server_info', function (req, res) {
  const os = require('os');

  const response = {
    'Версия ОС': os.version ? os.version() : 'Не удалось определить ОС сервера!'
  }
  res.send(
    JSON.stringify(response)
  )

})

// Запуск приложение на определенном порту
app.listen(3000);