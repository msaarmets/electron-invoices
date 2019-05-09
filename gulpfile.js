'use strict';
 
var gulp = require('gulp');
var _sass = require('gulp-sass');
var concat = require('gulp-concat');
const del = require('del');
 
sass.compiler = require('node-sass');

function sass(){
    return (
    gulp.src('./assets/scss/*.scss')
    .pipe(_sass())
    .on('error', _sass.logError)
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./assets/dist/'))
    );
}

function cleanDistFolder(){
    return del(['./assets/dist/']);
}

function js(){
    return(
        gulp.src('./assets/js/renderProcess/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./assets/dist/'))
    )
}

function watch(){
    gulp.watch('./assets/scss/*.scss', sass);
    gulp.watch('./assets/js/*.js', js);

}

exports.sass = gulp.series(cleanDistFolder, sass);
exports.js = gulp.series(cleanDistFolder, js);
exports.watch = watch;
exports.default = watch;

