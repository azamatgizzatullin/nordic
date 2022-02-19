const {
    NAMES_EVENT,
    URL
} = require('./const')

const {GET, GET_ALL, GET_BY_CATEGORY, ADD, EDIT, DEL} = require('./handlers')

module.exports = {
    'URL': URL,
    'INIT': (eventEmitter, res, req) => {
        console.log('2 Этап:  INIT')
        eventEmitter.on(NAMES_EVENT.GET_LIST, () => {
            GET_ALL(res, req)
        });
        eventEmitter.on(NAMES_EVENT.GET_ITEM, () => {
            GET(res, req)
        });
        eventEmitter.on(NAMES_EVENT.GET_BY_CATEGORY, () => {
            GET_BY_CATEGORY(res, req)
        });
        eventEmitter.on(NAMES_EVENT.DEL_ITEM, () => { 
            console.log("ЭТАП DEL eventEmitter INIT")
            DEL(res, req)
        });
        eventEmitter.on(NAMES_EVENT.EDIT, () => {
            EDIT(res, req)
        });
        eventEmitter.on(NAMES_EVENT.ADD,  () => {
            ADD(res, req)
        });
    },
    'GET_ALL': (eventEmitter) => {
        console.log('2 Этап: Роут get_all_good')
        eventEmitter.emit(NAMES_EVENT.GET_LIST)
    },
    'GET_ITEM': (eventEmitter) => {
        console.log('2 Этап: GET_ITEM')
        eventEmitter.emit(NAMES_EVENT.GET_ITEM)
    },
    'ADD': (eventEmitter) => {
        eventEmitter.emit(NAMES_EVENT.ADD)
    }, 
    'EDIT': (eventEmitter) => {
        console.log('3 Этап: EDIT')
        eventEmitter.emit(NAMES_EVENT.EDIT)
    },
    'GET_BY_CATEGORY': (eventEmitter) => {
        console.log('3 Этап: Роут get_list_by_category GET_BY_CATEGORY')
        eventEmitter.emit(NAMES_EVENT.GET_BY_CATEGORY)
    },
    'DEL_ITEM':(eventEmitter) => {
        console.log("ЭТАП DEL_ITEM Вызов хэндлера")
        eventEmitter.emit(NAMES_EVENT.DEL_ITEM)
    }
}