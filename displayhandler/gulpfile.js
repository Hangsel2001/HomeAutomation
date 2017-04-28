var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var JasmineConsoleReporter = require('jasmine-console-reporter');
var reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2 
    cleanStack: 1,       // (0|false)|(1|true)|2|3 
    verbosity: 4,        // (0|false)|1|2|(3|true)|4 
    listStyle: 'indent', // "flat"|"indent" 
    activity: false
});
var plumber = require('gulp-plumber');
gulp.task("test", (done)=>{
   gulp.src("spec/**/*.spec.js").pipe(plumber()).pipe(jasmine({reporter: reporter}))
           .on('error', function(err) {
            console.log(err.toString());
        })
        .on('finish', done);
});

gulp.task("watch", ()=>{
    gulp.watch("**/*.js",["test"]);
}) 