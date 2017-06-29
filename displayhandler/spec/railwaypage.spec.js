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
     })