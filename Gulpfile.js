var browserify = require('browserify')
var gulp   = require('gulp')
var babel  = require('gulp-babel')
var rjs    = require('requirejs')
var fs     = require('fs')
var mkdirp = require('mkdirp')
var del    = require('del')
var runseq = require('run-sequence')
var source = require('vinyl-source-stream')

var pluginPath = 'extplug/chat-images'

gulp.task('clean-lib', function (cb) {
  del('lib', cb)
})

gulp.task('babel', function () {
  return gulp.src('src/**/*')
    .pipe(babel({ modules: 'amd' }))
    .pipe(gulp.dest('lib/'))
})

gulp.task('lib-youtube-regex', function () {
  return browserify({
    entries: './node_modules/youtube-regex/index.js',
    standalone: 'youtube-regex'
  })
    .bundle()
    .pipe(source('youtube-regex.js'))
    .pipe(gulp.dest('build/_deps/'))
})

gulp.task('rjs', function (done) {
  // these paths are defined at runtime, so the r.js optimizer can't find them
  var paths = {
    // plug files, define()d by plug-modules
    plug: 'empty:',
    // extplug defines
    extplug: 'empty:',
    // plug.dj language files
    lang: 'empty:',
    // libraries used by plug.dj
    backbone: 'empty:',
    jquery: 'empty:',
    underscore: 'empty:',
    // libraries used by extplug
    meld: 'empty:',
    'plug-modules': 'empty:',
    // libraries used by chat-images
    'youtube-regex': 'build/_deps/youtube-regex'
  }

  paths[pluginPath] = 'lib/'

  rjs.optimize({
    baseUrl: './',
    name: pluginPath + '/main',
    paths: paths,
    optimize: 'none',
    out: function (text) {
      mkdirp('build', function (e) {
        if (e) done(e)
        else   fs.writeFile('build/chat-images.js', text, done)
      })
    }
  })
})

gulp.task('build', function (cb) {
  runseq('clean-lib', [ 'babel', 'lib-youtube-regex' ], 'rjs', cb)
})
