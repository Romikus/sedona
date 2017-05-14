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
var imagemin = require("gulp-imagemin");
var del = require("del");
var run = require("run-sequence");

gulp.task("style", function() {
    var prefixer = [autoprefixer({browsers: ["last 2 version"]})];

    gulp.src("sass/style.scss")
    	.pipe(plumber())
        .pipe(sass({
          includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe(postcss(prefixer))
        .pipe(gulp.dest("build/css"))
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});

gulp.task("svg", function() {
    var spriteSvg = gulp.src("build/img/icons/*.svg")
      .pipe(svgmin())
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(rename("symbols.svg"))
      .pipe(gulp.dest("build/img/"));

    function fileContents(filePath, file) {
      return file.contents.toString();
    }

    return gulp.src("*.html")
      .pipe(inject(spriteSvg, { transform: fileContents }))
      .pipe(gulp.dest("./"));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "*.html",
    "*.png"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
  run("clean", "copy", "style", "images", "svg", fn);
});

gulp.task("serve", function() {
    browserSync.init({
        server: "build",
        notify: false,
 		open: true,
		cors: true,
		ui: false
    });

    gulp.watch("sass/**/*{.scss,sass}", ["style"]);
    gulp.watch("*.html").on("change", browserSync.reload);
    gulp.watch("js/*.js").on("change", browserSync.reload);
});
