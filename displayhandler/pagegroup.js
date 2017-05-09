"use strict";
const EventEmitter = require('events').EventEmitter;

class PageGroup extends EventEmitter {
    constructor() {
        super();
        this.pageCallback = (message)=> { 
            this.emit("update", message);
        }
    }
    
    setPages(pages) {

        this.index = 0;
        this.pages = pages;
        this.setActivePage(0);
    }
    setActivePage(index) {
        if (this.activePage) {
            this.activePage.removeListener("update", this.pageCallback);
        }
        this.index = index;
        this.activePage = this.pages[index];

        this.activePage.on("update", this.pageCallback);
    }
    getDisplay() {
        return this.activePage.getDisplay();
    }
    next() {
        let newIndex = this.index + 1;
        if (newIndex >= this.pages.length) {
            newIndex = 0;
        }
        this.setActivePage(newIndex);
    }
    prev() {
        var newIndex = this.index - 1;
        if (newIndex < 0) {
            newIndex = this.pages.length -1;
        }
        this.setActivePage(newIndex);
    }
}

module.exports = PageGroup;