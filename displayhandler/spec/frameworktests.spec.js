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
    it("uses default fallback with null", ()=> {
        expect(null||"Hej").toBe("Hej");
    })

    it("calls doSomething", function () {
        function MyTestProto() {};
        MyTestProto.prototype.doSomething = function() {};
        spyOn(MyTestProto.prototype, "doSomething");
        let dummy = new MyTestProto();
        dummy.doSomething();
        expect(MyTestProto.prototype.doSomething).toHaveBeenCalled();

    });

})