const fs = require('fs')

class Files{

    constructor(){
        console.log('init class files')
    }
    
    add(file){
        //Получим путь к файлу
        const pathToFile = file.path
        const nameFile = file.filename
        //Уазываем подробный путь для записи файла, вместе с его названием
        const targetPath = "uploads/" + file.originalname
        // Путь к файлу, который мы должны прочитать
        // Читаем файл
        const src = fs.createReadStream(pathToFile, 'utf8')
        // Записываем файл
        const dest = fs.createWriteStream(targetPath)
        
        src.pipe(dest);

        // Описывает событие, которое происходит после загрузки файла
        src.on('end', () => {
            this.del(nameFile)
            console.log('Загрузка завершилась УСПЕШНО!')
        })

        // Описывает событие, которое происходит при ошибке загрузки файла
        src.on('error', function(){
            console.log('Загрузка завершилась с ОШИБКОЙ!')
        })
        
    }

    get(name, callback){
        //console.log(name)
        /*fs.readFile(`uploads/${name}`, (error, data) => {
            callback(data)
        })*/
        console.log(name)
        const rootPath = process.env.PWD;
        const folderPath = './uploads/'
        fs.readdirSync('./uploads/').map(fileName => {
            if(name == fileName)
                callback(path.join(folderPath, fileName))
        })
    }

    del(fileName, res){
        if(fileName){
          fs.unlink(`uploads/${fileName}`, (error) => {
            if(error){
                console.log('Файл не удалось удалить!')
            }else {
                console.log(`Файл ${fileName} успешно удален`)
            }
          })
        }else console.log('Укажите название файла!')
    }

}

module.exports = Files