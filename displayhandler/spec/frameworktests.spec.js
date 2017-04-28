     var events = require('events');
describe ("framework tests", ()=> {    
    it("emitter emits", (done)=> {      
        let eventer = new events.EventEmitter();
        eventer.on('update',()=> {
            expect(true).toBeTruthy();
            done(); 
        }) ;
        eventer.emit("update");          
    });
})