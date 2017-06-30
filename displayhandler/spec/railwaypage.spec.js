     var events = require('events');
     var RailwayPage = require('../railwaypage');
     describe("RailwayPage", ()=> {
         let socket, page;
         beforeEach(()=> {
             socket = new events.EventEmitter();
             page = new RailwayPage({socket:socket});
         })
         it("constructs", ()=>{
             
         })
         it("shows loco in outerleft when loco is in", ()=>{
         	socket.emit("block", { 
         		name: "OuterLeft",
         		loco: {},
         		entryDirection: "ccw",
         		status:"in"});
         	const expected= "\x06\x01\x02";
         	expect(page.getDisplay().substring(0, 3)).toEqual(expected);
         	
         });
         it("shows empty track when no loco",()=>{
         	expect(page.getDisplay()).toEqual(page.tracks);
         });
         
     })