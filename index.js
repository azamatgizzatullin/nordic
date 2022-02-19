//Импорт модулей внешних
const express = require('express');
var events = require('events');
const multerGood = require('multer')

//Импорт модулей внутренних
var moduleUser = require('./modules/user/index');
var moduleGood = require('./modules/good/index');
var Files = require('./modules/files/index')
//Создаем объект для работы с файлом
const files = new Files()

// Настройки модулей
const app = express();
const eventEmitter = new events.EventEmitter();
const uploadGood = multerGood({dest: 'uploads/'})
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

  if(req.file) {
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
    FILE_IMG:  req.file ? req.file.originalname : ''
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
app.post('/add_item_good_form',  typeAddGood, function (req, res) {

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
          FILE_IMG:  req.file.originalname
  
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

// Роут для получения отзывов о товаре
app.get('/back', function (req, res) {

})


// Инструменты для работы с АПИ напрямую

//Конект для форм
const connection = require('./modules/connect')

// Форма для удаления товара
app.get('/form_del_item_good', function(req, res){

  const sql = `SELECT * FROM good`;
  
  connection.query(
      sql,
      (err, result) => {
         if(err){
           res.send(err)
         } else {
          
        let select = `<select name='id'>`
  
        result.forEach((item, index)=> {
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
app.get('/form_add_item_good', function(req, res){

  const sql = `SELECT * FROM category`;
  
  connection.query(
      sql,
      (err, result) => {
         if(err){
           res.send(err)
         } else {
          
        let select = `<select name='CATEGORY_ID'>`
  
        result.forEach((item, index)=> {
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
app.get('/form_edit_item_good', function(req, res){

  const sql = `SELECT * FROM category`;
  const idGood = req.query.id

  !idGood && res.send(`Не указан ID товара`)

  connection.query(
      sql,
      (err, result) => {
         if(err){
           res.send(err)
         } else {
          
        let select = `<select name='CATEGORY_ID'>`
  
        result.forEach((item, index)=> {
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
app.get('/download', function(req, res){
    res.download(`./uploads/${req.query.filename}`);
})

//Информация об операционной системе сервера
app.get('/server_info', function(req, res){
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