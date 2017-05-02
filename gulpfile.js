"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var browserSync = require("browser-sync").create();

var svgmin = require("gulp-svgmin");
var svgstore = require('gulp-svgstore');
var rename = require("gulp-rename");
var inject = require("gulp-inject");

gulp.task("style", function() {
    var prefixer = [autoprefixer({browsers: ["last 2 version"]})];

    gulp.src("sass/style.scss")
    	.pipe(plumber())
        .pipe(sass({
          includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe(postcss(prefixer))
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task("svg", function() {
    var spriteSvg = gulp.src("img/icons/*.svg")
      .pipe(svgmin())
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(rename("symbols.svg"))
      .pipe(gulp.dest("img/"));

    function fileContents(filePath, file) {
      return file.contents.toString();
    }

    return gulp.src("*.html")
      .pipe(inject(spriteSvg, { transform: fileContents }))
      .pipe(gulp.dest("./"));
});

gulp.task("serve", ["style"], function() {
    browserSync.init({
        server: ".",
        notify: false,
 		open: true,
		cors: true,
		ui: false
    });

    gulp.watch("sass/**/*{.scss,sass}", ["style"]);
    gulp.watch("*.html").on("change", browserSync.reload);
    gulp.watch("js/*.js").on("change", browserSync.reload);
});
