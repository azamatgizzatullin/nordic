const {
    NAMES_EVENT,
    URL
} = require('./const')

const {GET, GET_ALL, ADD, EDIT, DEL} = require('./handlers')

module.exports = {
    'URL': URL,
    'INIT': (eventEmitter, res, req) => {
        console.log('0 Этап:  INIT')
        eventEmitter.on(NAMES_EVENT.GET_COMMENTS, () => {
            GET_ALL(res, req)
        });
        eventEmitter.on(NAMES_EVENT.GET_COMMENT, () => {
            GET(res, req)
        });
        eventEmitter.on(NAMES_EVENT.DEL_COMMENT, () => { 
            //console.log("ЭТАП DEL eventEmitter INIT")
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
        console.log('2 Этап: Роут get_all_comments')
        eventEmitter.emit(NAMES_EVENT.GET_COMMENTS)
    },
    'GET_COMMENT': (eventEmitter) => {
        eventEmitter.emit(NAMES_EVENT.GET_COMMENT)
    },
    'ADD': (eventEmitter) => {
        eventEmitter.emit(NAMES_EVENT.ADD)
    }, 
    'EDIT': (eventEmitter) => {
        console.log('3 Этап: EDIT')
        eventEmitter.emit(NAMES_EVENT.EDIT)
    },
    'DEL_COMMENT':(eventEmitter) => {
        console.log("ЭТАП DEL_ITEM Вызов хэндлера")
        eventEmitter.emit(NAMES_EVENT.DEL_COMMENT)
    }
}