var gulp = require('gulp');
var less = require('gulp-less');
var browserify = require('gulp-browserify');
var browsersync = require('browser-sync');
var gwatch = require('gulp-watch');
var clean = require('gulp-clean');
var runsequence = require('run-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var rename = require('gulp-rename');


var browsersync_server = browsersync.create();
var reload = browsersync_server.reload;
var root = {
    src: 'front/src',
    dist: 'front/dist'
};

var path = {
    view: {
        src: [root.src + '/view/**/*.jade'],
        dist: root.dist + '/view'
    },
    style: {
        src: [root.src + '/style/**/*.less'],
        dist: root.dist + '/static/style'
    },
    script: {
        src: [root.src + '/script/**/*.js'],
        dist: root.dist + '/static/script'
    },
    lib: {
        src: [root.src + '/lib/**/*'],
        dist: root.dist + '/static/lib'
    },
    module: {
        src: [root.src + '/module/**/*'],
        dist: root.dist + '/static/module'
    },
    img: {
        src: [root.src + '/img/**/*'],
        dist: root.dist + '/static/img'
    },
    clean: {
        src: root.dist
    },
    file: {
        src: [root.src + '/file/**/*'],
        dist: root.dist + '/static/file'
    }
};

var module_path = {
    browsersync: {
        src: [root.dist + '/view/*.jade', root.dist + '/static/script/**/*', root.dist + '/static/style/**/*', root.dist + '/static/img/**/*']
    }
}

gulp.task('lib', function() {
    gulp.src(path.lib.src)
        .pipe(plumber())
        .pipe(gulp.dest(path.lib.dist))
        ;
})

gulp.task('module', function() {
    gulp.src(path.module.src)
        .pipe(gulp.dest(path.module.dist))
        ;
})

gulp.task('img', function() {
    gulp.src(path.img.src)
        .pipe(plumber())
        .pipe(gulp.dest(path.img.dist))
        ;
})

gulp.task('file', function() {
    gulp.src(path.file.src)
        .pipe(plumber())
        .pipe(gwatch(path.file.dist))
        .pipe(gulp.dest(path.file.dist))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'File task complete'}))
        ;
})

gulp.task('view', function() {
    gulp.src(path.view.src)
        .pipe(plumber())
        .pipe(gwatch(path.view.src))
        .pipe(rename(function(path) {
          path.dirname = ''
        }))
        .pipe(gulp.dest(path.view.dist))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'View task complete'}))
    ;
});

gulp.task('browserify_script', function() {
    gulp.src(path.script.src)
        .pipe(plumber())
        .pipe(gwatch(path.script.src))
        .pipe(browserify({
            debug: true
        }))
        .pipe(rename(function(path) {
          path.dirname = ''
        }))
        .pipe(gulp.dest(path.script.dist))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'Script task complete'}))
    ;
});

gulp.task('less', function() {
  gulp.src(path.style.src)
    .pipe(plumber())
    .pipe(gwatch(path.style.src))
    .pipe(less())
    .pipe(rename(function(path) {
      path.dirname = ''
    }))
    .pipe(gulp.dest(path.style.dist))
    .pipe(reload({stream: true}))
    .pipe(notify({message: 'Less task complete'}));
});

gulp.task('browsersync', function() {
  browsersync.init({
    files: module_path.browsersync.src,
    // server: {
    //   baseDir: root.dist
    // }
    proxy: 'http://localhost:3080'
  });
});

gulp.task('clean', function() {
  return gulp.src([path.clean.src], {read: false})
    .pipe(clean());
});


gulp.task('watch', function(err){
  gwatch(root.src + '/**', function(event) {
    // console.log(event.name, event.verbose, event.base, event)
    if (event.event === 'unlink') {
      runsequence('clean',['view', 'browserify_coffee', 'less', 'img']);
    }
  });
  // 由于使用了browserify，一个文件的改变会影响所有其它引用到他的文件，所以应该重新编译
  // gwatch(path.own_module.src, function(event) {
    // if (event.event !== 'unlink') {
      // runsequence('browserify_coffee');       
    // }
  // })

});


gulp.task('default', ['clean'], function(){
  // return gulp.start('view', 'browserify_module', 'browserify_coffee', 'less', 'watch');
  runsequence('lib', 'module', 'browserify_script', 'less', 'view', 'browsersync', 'img', 'file', 'watch');
});

gulp.task('build', ['clean'], function(){
  // return gulp.start('view', 'browserify_module', 'browserify_coffee', 'less', 'watch');
  runsequence('lib', 'module', 'browserify_script', 'less', 'view', 'img', 'file');
});
