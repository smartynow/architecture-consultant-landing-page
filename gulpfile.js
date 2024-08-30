import gulp from "gulp";
import replace from "gulp-replace";
import * as nodePath from "path";
import { deleteAsync } from "del";
import browserSync from "browser-sync";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import cleanCSS from "gulp-clean-css";
import autoPrefixer from "gulp-autoprefixer";
import rename from "gulp-rename";
import webpack from "webpack";
import gulpWebpack from "webpack-stream";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import newer from "gulp-newer";

//paths
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`;
const srcFolder = `./src`;

const path = {
  build: {
    img: `${buildFolder}/assets/images/`,
    js: `${buildFolder}/assets/scripts/`,
    css: `${buildFolder}/assets/styles/`,
    vendorJs: `${buildFolder}/assets/scripts/vendor`,
    vendorCss: `${buildFolder}/assets/styles/vendor/`,
    html: `${buildFolder}/`,
    font: `${buildFolder}/assets/fonts/`,
  },
  src: {
    img: `${srcFolder}/assets/images/**/*`,
    js: `${srcFolder}/assets/scripts/scripts.js`,
    scss: `${srcFolder}/assets/styles/styles.scss`,
    vendorJs: `${srcFolder}/assets/scripts/vendor/**/*.js`,
    vendorCss: `${srcFolder}/assets/styles/vendor/**/*`,
    html: `${srcFolder}/*.html`,
    font: `${srcFolder}/assets/fonts/**/*.*`,
  },
  watch: {
    img: `${srcFolder}/assets/images/**/*`,
    js: `${srcFolder}/assets/scripts/**/*.js`,
    scss: `${srcFolder}/assets/styles/**/*.scss`,
    vendorJs: `${srcFolder}/assets/scripts/vendor/**/*.js`,
    vendorCss: `${srcFolder}/assets/styles/vendor/**/*`,
    html: `${srcFolder}/*.html`,
    font: `${srcFolder}/assets/fonts/**/*.*`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
  ftp: ``,
};

//tasks
const reset = () => {
  return deleteAsync(path.clean);
}; //delete files to dist

const html = () => {
  return gulp
    .src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
}; //build html files

const scss = () => {
  return gulp
    .src(path.src.scss, { sourcemaps: true })
    .pipe(replace(/@img\//g, "../img/"))
    .pipe(
      sass({
        outputStyle: "expanded",
      }),
    )
    .pipe(
      autoPrefixer({
        grid: true,
      }),
    )
    .pipe(gulp.dest(path.build.css))
    .pipe(cleanCSS())
    .pipe(
      rename({
        extname: ".min.css",
      }),
    )
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
}; //build css file

const js = () => {
  return gulp
    .src(path.src.js, { sourcemaps: true })
    .pipe(
      gulpWebpack(
        {
          mode: "development",
          output: {
            filename: "scripts.min.js",
          },
          module: {
            rules: [
              {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
              },
            ],
          },
        },
        webpack,
      ),
    )
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
}; //build js file

const img = () => {
  return gulp
    .src(path.src.img, { encoding: false })
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream());
}; //copy font to dist
const font = () => {
  return gulp
    .src(path.src.font, { encoding: false })
    .pipe(gulp.dest(path.build.font))
    .pipe(browserSync.stream());
}; //copy font to dist

const vendorJs = () => {
  return gulp
      .src(path.src.vendorJs, { encoding: false })
      .pipe(gulp.dest(path.build.vendorJs))
      .pipe(browserSync.stream());
}; //copy vendor's scripts to dist
const vendorCss = () => {
  return gulp
      .src(path.src.vendorCss, { encoding: false })
      .pipe(gulp.dest(path.build.vendorCss))
      .pipe(browserSync.stream());
}; //copy vendor's styles to dist


const server = (done) => {
  browserSync.init({
    server: {
      baseDir: `${path.build.html}`,
    },
    port: 3000,
  });
}; //Local server

//watcher
function watcher() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.vendorJs, vendorJs);
  gulp.watch(path.watch.vendorCss, vendorCss);
  gulp.watch(path.watch.img, img);
  gulp.watch(path.watch.font, font);
}

//scripts
const mainTasks = gulp.parallel(html, scss, js, vendorJs, vendorCss,  img, font);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);

gulp.task("default", dev);
gulp.task("build", build);
