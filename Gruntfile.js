module.exports = function(grunt) {

  'use strict';

  var path = require('path');

  require('time-grunt')(grunt);

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
          targetDir: './src/static/vendor/',
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
        src: ['src/static/vendor/fj-*/*.less', 'src/static/vendor/cf-*/*.less'],
        dest: 'src/static/vendor/cf-concat/cf.less'
      },
      ie9: {
        src: ['src/static/js/legacy/ie9.js', 'node_modules/es5-shim/es5-shim.js', 'src/static/vendor/polyfill/web.js', 'src/static/vendor/Placeholders.js/lib/utils.js', 'src/static/vendor/Placeholders.js/lib/main.js'],
        dest: 'dist/static/js/ie9.js'
      },
      ie8: {
        src: ['src/static/vendor/html5shiv/html5shiv.js', 'src/static/vendor/respond/respond.src.js', 'src/static/js/legacy/lte-ie8.js', 'node_modules/es5-shim/es5-shim.js', 'src/static/vendor/Placeholders.js/lib/utils.js', 'src/static/vendor/Placeholders.js/lib/main.js'],
        dest: 'dist/static/js/lte-ie8.js'
      }
    },

    /**
     * LESS: https://github.com/gruntjs/grunt-contrib-less
     *
     * Compile LESS files to CSS.
     * Source maps are slow, so they're separated into their own task for when needed
     */
    less: {
      watch: {
        options: {
          paths: grunt.file.expand('src/static/vendor/**/')
        },
        files: {
          './dist/static/css/main.css': ['./src/static/css/main.less']
        }
      },
      map: {
        options: {
          paths: grunt.file.expand('src/static/vendor/**/'),
          sourceMap: true,
          sourceMapRootpath: '/'
        },
        files: {
          './dist/static/css/main.css': ['./src/static/css/main.less']
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
        // Prefix all CSS files found in `src/static/css` and overwrite.
        expand: true,
        src: 'dist/static/css/main.css'
      },
    },

    browserify: {
      build: {
        src: ['./src/static/js/modules/loan-options.js',
        './src/static/js/modules/rates.js', './src/static/js/modules/check-rates.js', './src/static/js/modules/loan-comparison.js', './src/static/js/modules/prepare-worksheets/prepare-worksheets.js', './src/static/js/modules/form-explainer.js', './src/static/js/modules/home.js'],
        dest: 'dist/static/js/main.js',
        options: {
          transform: ['browserify-shim', 'hbsfy'],
          plugin: [
            ['factor-bundle', {
              entries: ['./src/static/js/modules/loan-options.js',
'./src/static/js/modules/rates.js',
'./src/static/js/modules/check-rates.js', './src/static/js/modules/loan-comparison.js', './src/static/js/modules/prepare-worksheets/prepare-worksheets.js', './src/static/js/modules/form-explainer.js', './src/static/js/modules/home.js', './src/static/js/modules/loan-options-subpage.js'],
              o: ['dist/static/js/loan-options.js', 'dist/static/js/rates.js', 'dist/static/js/check-rates.js', 'dist/static/js/loan-comparison.js', 'dist/static/js/prepare-worksheets.js', 'dist/static/js/form-explainer.js', 'dist/static/js/home.js', 'dist/static/js/loan-options-subpage.js']
            }]
          ]
        }
      },
      tests: {
        files: {
          './test/compiled_tests.js': ['./test/js/*.js'],
        },
        options: {
          watch: true,
          debug: true,
          transform: ['browserify-shim', 'hbsfy']
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
        files: {
          './dist/static/css/main.min.css': ['./dist/static/css/main.css'],
        }
      }
    },

    /**
     * Uglify: https://github.com/gruntjs/grunt-contrib-uglify
     *
     * Minify files with UglifyJS.
     */
    uglify: {
      main: {
        files: {
          './dist/static/js/main.js': ['./dist/static/js/main.js']
        }
      },
      pages: {
        files: [{
          expand: true,
          cwd: './dist/static/js',
          src: ['rates.js', 'loan-options.js', 'check-rates.js', 'loan-comparison.js', 'prepare-worksheets.js', 'home.js', 'loan-options-subpage.js'],
          dest: './dist/static/js'
        }]
      },
      ie9: {
        files: {
          './dist/static/js/ie9.min.js': ['./dist/static/js/ie9.js']
        }
      },
      ie8: {
        files: {
          './dist/static/js/lte-ie8.min.js': ['./dist/static/js/lte-ie8.js']
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
            cwd: 'src',
            src: [
              // move html & template files new template folders need to be added here
              '**/*.html',
              '_layouts/*',
              'resources/*'
            ],
            dest: 'dist/'
          }
        ]
      },
      release: {
        files:
        [
          {
            expand: true,
            cwd: 'src',
            src: [
              // Move html & template files new template folders need to be added here.
              'index.html',
              'loan-options/**',
              'check-rates/**',
              '_layouts/*',
              'resources/*'
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
              'src/static/img/**/*'
            ],
            dest: 'dist/static/img/'
          }
        ]
      },
      fonts: {
        files:
        [
          {
            expand: true,
            flatten: true,
            src: [
              // move images to static directory
              'src/static/fonts/**/*'
            ],
            dest: 'dist/static/fonts/'
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
        'src/static/js/**/*',
        '!node_modules/**/*',
        '!src/static/js/main.js'
      ]
    },
    mocha_istanbul: {
      coverage: {
        src: ['test/js/*.js'], // multiple folders also works
        options: {
          harmony: true,
          coverageFolder: 'test/coverage',
          coverage: true,
          check: {
            lines: 50,
            statements: 50
          }
        }
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

    usemin: {
      html: ['dist/_layouts/base.html']
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
    },

    concurrent: {
      all: ['css', 'js']
    },

    /**
     * Watch: https://github.com/gruntjs/grunt-contrib-watch
     *
     * Run predefined tasks whenever watched file patterns are added, changed or deleted.
     * Add files to monitor below.
     */
    watch: {
      js: {
        options: {
          interrupt: true,
        },
        files: ['Gruntfile.js', 'src/static/js/app.js', 'src/static/js/modules/**/*.js', 'src/static/js/templates/**/*.hbs'],
        tasks: ['build']
      },
      css: {
        options: {
          interrupt: true,
        },
        files: ['Gruntfile.js', 'src/static/css/*.less', 'src/static/css/module/*.less', 'src/static/js/templates/**/*.hbs'],
        tasks: ['css', 'cssmin']
      },
      all: {
        options: {
          interrupt: true,
        },
        files: ['Gruntfile.js', 'src/static/css/*.less', 'src/static/css/module/*.less', 'src/static/js/app.js', 'src/static/js/modules/**/*.js', 'src/static/js/templates/**/*.hbs', 'src/**/*.html', '_layouts/*'],
        tasks: ['build']
      }
    }

  });

  grunt.event.on('coverage', function( lcov, done ) {
    require('coveralls').handleInput( lcov, function( err ) {
      if ( err ) {
        return done( err );
      }
      done();
    });
  });

  /**
   * Load the tasks.
   */
  grunt.loadNpmTasks('grunt-usemin');
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('reset', ['clean:dist', 'copy:dist']);
  grunt.registerTask('js', ['newer:browserify:build']);
  grunt.registerTask('css', ['newer:less:watch', 'newer:autoprefixer']);

  grunt.registerTask('vendor', ['clean:bowerDir', 'bower:install', 'concat:cf-less']);
  grunt.registerTask('build', ['reset', 'js', 'css', 'copy', 'concat:ie9', 'concat:ie8', 'test']);
  grunt.registerTask('ship', ['uglify', 'cssmin', 'usebanner']);
  grunt.registerTask('test', ['browserify:tests', 'mocha_istanbul']);
  grunt.registerTask('release', ['clean:dist', 'js', 'css', 'copy:release', 'copy:img', 'copy:fonts', 'concat:ie9', 'concat:ie8']);
  grunt.registerTask('deploy', ['release', 'ship']);
  grunt.registerTask('default', ['build', 'ship']);

};