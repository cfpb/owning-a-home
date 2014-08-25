// required for browserify shimming
var shims = require('./config/shim'),
    sharedModules = Object.keys(shims);

module.exports = function(grunt) {

  'use strict';

  var path = require('path');

  grunt.initConfig({

    /**
     * Pull in the package.json file so we can read its metadata.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Bower: https://github.com/yatskevich/grunt-bower-task
     *
     * Install Bower packages and migrate static assets.
     */
    bower: {
      install: {
        options: {
          targetDir: './src/vendor/',
          install: true,
          verbose: true,
          cleanBowerDir: true,
          cleanTargetDir: true,
          layout: function(type, component) {
            if (type === 'img') {
              return path.join('../img');
            } else if (type === 'fonts') {
              return path.join('../fonts');
            } else {
              return path.join(component);
            }
          }
        }
      }
    },

    /**
     * Concat: https://github.com/gruntjs/grunt-contrib-concat
     *
     * Concatenate cf-* LESS files prior to compiling them.
     */
    concat: {
      'cf-less': {
        src: ['src/vendor/fj-*/*.less', 'src/vendor/cf-*/*.less'],
        dest: 'src/vendor/cf-concat/cf.less',
      },
      ie9: {
        src: ['src/vendor/polyfill/web.js', 'src/vendor/polyfill/Placeholders.js/lib/main.js', 'src/vendor/polyfill/Placeholders.js/lib/utils.js'],
        dest: 'static/js/lte-ie9.js',
      }
    },

    /**
     * LESS: https://github.com/gruntjs/grunt-contrib-less
     *
     * Compile LESS files to CSS.
     */
    less: {
      main: {
        options: {
          paths: grunt.file.expand('src/vendor/**/'),
          sourceMap: true,
          sourceMapRootpath: '/'
        },
        files: {
          './static/css/main.css': ['./src/css/main.less']
        }
      }
    },

    /**
     * Autoprefixer: https://github.com/nDmitry/grunt-autoprefixer
     *
     * Parse CSS and add vendor-prefixed CSS properties using the Can I Use database.
     */
    autoprefixer: {
      options: {
        // Options we might want to enable in the future.
        diff: false
      },
      multiple_files: {
        // Prefix all CSS files found in `src/css` and overwrite.
        expand: true,
        src: 'static/css/main.css'
      },
    },

    browserify: {
      build: {
        files: {
          'static/js/main.js': ['./src/js/**/*.js', './config/*.js'],
        },
        options: {
          watch: true,
          transform: ['browserify-shim', 'hbsfy'],
          require: sharedModules
        }
      },
      tests: {
        files: {
          './test/compiled_tests.js': ['./test/js/*.js'],
        },
        options: {
          watch: true,
          debug: true
        }
      }
    },

    /**
     * Banner: https://github.com/mattstyles/grunt-banner
     *
     * Here's a banner with some template variables.
     * We'll be inserting it at the top of minified assets.
     */
    banner:
      '/*\n' +
      '            /$$$$$$          /$$        \n' +
      '           /$$__  $$        | $$        \n' +
      '  /$$$$$$$| $$  \\__//$$$$$$ | $$$$$$$  \n' +
      ' /$$_____/| $$$$   /$$__  $$| $$__  $$  \n' +
      '| $$      | $$_/  | $$  \\ $$| $$  \\ $$\n' +
      '| $$      | $$    | $$  | $$| $$  | $$  \n' +
      '|  $$$$$$$| $$    | $$$$$$$/| $$$$$$$/  \n' +
      ' \\_______/|__/    | $$____/ |_______/  \n' +
      '                  | $$                  \n' +
      '                  | $$                  \n' +
      '                  |__/                  \n' +
      '\n' +
      '* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* A public domain work of the <%= pkg.author.name %> */\n',

    usebanner: {
      taskName: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: true
        },
        files: {
          src: [ './dist/static/css/*.min.css', './dist/static/js/*.min.js' ]
        }
      }
    },

    /**
     * CSS Min: https://github.com/gruntjs/grunt-contrib-cssmin
     *
     * Minify CSS and optionally rewrite asset paths.
     */
    cssmin: {
      build: {
        options: {
          //root: '/src/'
        },
        files: {
          './dist/static/css/main.min.css': ['./dist/static/css/main.css'],
        }
      }
    },

    uglify: {
      build: {
        files: {
          './dist/static/js/main.min.js': ['./dist/static/js/main.js']
        }
      }
    },

    /**
     * Clean: https://github.com/gruntjs/grunt-contrib-clean
     *
     * Clear files and folders.
     */
    clean: {
      bowerDir: ['bower_components'],
      dist: ['dist/**/*', '!dist/.git/']
    },

    /**
     * Copy: https://github.com/gruntjs/grunt-contrib-copy
     *
     * Copy files and folders.
     */
    copy: {
      dist: {
        files:
        [
          {
            expand: true,
            cwd: '.',
            src: [
              // move html & template files
              '*.html',
              '_layouts/**/*',
              // move static files
              'static/**/*',
            ],
            dest: 'dist/'
          }
        ]
      },
      img: {
        files:
        [
          {
            expand: true,
            flatten: true,
            src: [
              // move images to static directory
              'src/img/**/*',
            ],
            dest: 'static/img/'
          }
        ]
      },
      vendor: {
        files:
        [
          {
            expand: true,
            flatten: true,
            src: [
              // move shims to static directory
              'src/vendor/html5shiv/html5shiv.js',
              'src/vendor/respond/respond.src.js',
            ],
            dest: 'static/vendor/'
          }
        ]
      }
    },

    /**
     * JSHint: https://github.com/gruntjs/grunt-contrib-jshint
     *
     * Validate files with JSHint.
     * Below are options that conform to idiomatic.js standards.
     * Feel free to add/remove your favorites: http://www.jshint.com/docs/#options
     */
    jshint: {
      options: {
        asi: false,
        bitwise: true,
        boss: true,
        camelcase: true,
        eqeqeq: true,
        eqnull: true,
        evil: true,
        expr: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: false,
        maxdepth: 4,
        maxparams: 4,
        maxstatements: 300,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        quotmark: true,
        strict: false,
        trailing: true,
        undef: true,
        node: true,
        browser: true,
        jquery: true,
        globals: {
          jQuery: true,
          $: true,
          module: true,
          require: true,
          define: true,
          console: true,
          EventEmitter: true
        }
      },
      files: [
        'src/js/**/*',
        '!node_modules/**/*',
        '!src/js/main.js'
      ]
    },

    // run the mocha tests
    'mochaTest': {
      test: {
        options: {
          reporter: 'nyan'
        },
        src: ['test/js/*.js']
      }
    },

    /**
     * grunt-cfpb-internal: https://github.com/cfpb/grunt-cfpb-internal
     *
     * Some internal CFPB tasks.
     */
    'build-cfpb': {
      prod: {
        options: {
          commit: false,
          tag: false,
          push: false
        }
      }
    },

    /**
     * Watch: https://github.com/gruntjs/grunt-contrib-watch
     *
     * Run predefined tasks whenever watched file patterns are added, changed or deleted.
     * Add files to monitor below.
     */
    watch: {
      gruntfile: {
        files: ['Gruntfile.js', 'src/css/*.less', 'src/css/module/*.less', 'src/js/app.js', 'src/js/modules/**/*.js', 'src/js/templates/**/*.hbs'],
        tasks: ['compile']
      }
    },
    newer: {
      options: {
        override: function(detail, include) {
          if (detail.task === 'less') {
            include(true);
          } else {
            include(false);
          }
        }
      }
    }
  });

  /**
   * The above tasks are loaded here.
   */
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-newer');

  /**
   * Create custom task aliases and combinations
   */
  grunt.registerTask('vendor', ['clean:bowerDir', 'bower:install', 'concat:cf-less', 'copy:vendor']);
  grunt.registerTask('compile', ['newer:less', 'newer:browserify:build', 'autoprefixer', 'copy:img']);
  grunt.registerTask('dist', ['clean:dist', 'copy:dist', 'cssmin', 'uglify', 'usebanner']);
  grunt.registerTask('test', ['browserify:tests', 'mochaTest']);
  grunt.registerTask('default', ['compile', 'dist']);

};
