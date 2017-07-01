     var events = require('events');
     var RailwayPage = require('../railwaypage');
     describe("RailwayPage", () => {
         let socket, page;
         let locoLeft = "\x01\x02";
         let locoRight = "\x02\x01";
         beforeEach(() => {
             socket = new events.EventEmitter();
             page = new RailwayPage({
                 socket: socket
             });
         })
         it("constructs", () => {

         })
         it("shows loco in outerleft when loco is 'in'", () => {
             socket.emit("block", {"name":"OuterLeft","ccw":{"enter":3,"in":4},"status":"in","loco":{"name":"3","address":3,"direction":"backwards","functions":{"lights":true}}});
             const expected = "\x06" + locoLeft;
             expect(page.getDisplay().substring(0, 3)).toEqual(expected);
         });
         it("shows empty track when no loco", () => {
             expect(page.getDisplay()).toEqual(page.tracks);
         });

         it ("shows loco in exiting when no enter", ()=> {
                 socket.emit("block",{"name":"Middle","ccw":{"enter":0,"in":1},"short":true,"status":"reserved","loco":{"name":"3","address":3,"direction":"backwards","functions":{"lights":true}},"entryDirection":"cw"});
                 socket.emit("block",{"name":"OuterLeft","ccw":{"enter":5,"in":2},"status":"exiting","loco":{"name":"3","address":3,"direction":"backwards","functions":{"lights":true}},"entryDirection":"ccw"});
                 expect(page.getDisplay().substring(1, 3)).toEqual(locoLeft);
         })

         it("inserts in string", () => {
             let inserted = "XX";
             let original = "12345";
             expect(RailwayPage.insertAtIndex(original, inserted, 2, 0)).toBe("12XX5");
             let twolines = "12345\n12345";
             expect(RailwayPage.insertAtIndex(twolines, inserted, 1, 1)).toBe("12345\n1XX45");
         });

     })