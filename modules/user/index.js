const { NAMES_EVENT } = require('./const')
const { GET, GET_ALL, EDIT, ADD } = require('./handlers')

module.exports = {
    'GET_ALL': (eventEmitter) => {
        eventEmitter.emit(NAMES_EVENT.GET_ALL)
    },
    'GET_ITEM': (eventEmitter) => {
        console.log("2 этап GET_ITEM USER")
        eventEmitter.emit(NAMES_EVENT.GET)
    },
    'ADD': (eventEmitter) => {
        eventEmitter.emit(NAMES_EVENT.ADD)
    }, 
    'EDIT': (eventEmitter) => {
        eventEmitter.emit(NAMES_EVENT.EDIT)
    },
    'INIT': (eventEmitter, res, req) => {
        //Инициализируем 4 события
        console.log("этап INIT user")
        eventEmitter.on(NAMES_EVENT.ADD, () => {
            ADD(res, req)
        });
        eventEmitter.on(NAMES_EVENT.EDIT, () => {
            EDIT(res, req)
        });
        eventEmitter.on(NAMES_EVENT.GET, () => {
            GET(res, req)
        });
        eventEmitter.on(NAMES_EVENT.GET_LIST, () => {
            GET_ALL(res, req)
        });
    }
}