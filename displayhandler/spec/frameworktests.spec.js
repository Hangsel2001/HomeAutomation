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

    it("get string or object", ()=> {
        expect(typeof "Text").toBe("string");
        expect(typeof {color:7, text: "Hej"}).toBe("object");
        expect("Text".color).toBe(undefined);
        expect("Text".color).toBeFalsy();
        var obj = {color:7};
        expect(typeof obj.color).toBe("number");
        expect(typeof "Text".color).toBe("undefined");
        
        let result = hasColor(obj);
        expect(result).toBeTruthy();
        expect(hasColor("TEsT")).toBeFalsy();
    })

})

function hasColor(obj) {
    if (obj.color) {
        return true;
    }
    else {
        return false;
    }    
}
