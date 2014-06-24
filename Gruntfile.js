
module.exports = function(grunt) {

  'use strict';

  // Load all grunt tasks matching the `grunt-*` pattern.
  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', 'bootcamp'],
    scope: 'devDependencies'
  });

  // Time how long tasks take.
  require('time-grunt')(grunt);

  var config = {
    root: '.',
    base: 'test',
    scss: 'test/sass',
    css: 'test/css',
    img: 'test/img',
    src: 'sass',
    dist: 'dist'
  };

  var banner = [
    '// <%= pkg.title %> – v<%= pkg.version %>',
    ' – <%= grunt.template.today("yyyy-mm-dd") %>\n',
    '// <%= pkg.homepage %>\n',
    '// License: <%= pkg.license.type %>\n\n'
  ].join('');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    conf: config,

    shell: {
      sass: {
        command: function (target) {
          var command = [
            'bundle exec sass',
            '--style expanded',
            '--load-path',
            '<%= conf.root %>/' + config[target],
            '--load-path',
            '<%= conf.root %>/node_modules/bootcamp/dist',
            '--require SassyBitwise',
            '--update',
            '<%= conf.scss %>:<%= conf.css %>'
          ].join(' ');

          return grunt.template.process(command);
        }
      }
    },

    bootcamp: {
      test: {
        files: {
          src: ["<%= conf.css %>/specs.css"]
        }
      }
    },

    watch: {
      test: {
        files: ['<%= conf.scss %>/*.scss'],
        tasks: ['shell:sass:src', 'bootcamp']
      }
    },

    browserSync: {
      test: {
        bsFiles: {
          src: '<%= conf.css %>/*.css'
        },
        options: {
          watchTask: true,
          server: {
            baseDir: '<%= conf.base %>'
          }
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', '> 1%', 'ie 8']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= conf.css %>',
          src: '{,*/}*.css',
          dest: '<%= conf.css %>'
        }]
      }
    },

    concat: {
      options: {
        banner: banner,
      },
      dist: {
        src: [
          // helpers
          '<%= conf.src %>/helpers/_functions.scss',
          '<%= conf.src %>/helpers/_keys.scss',
          '<%= conf.src %>/helpers/_lists.scss',
          '<%= conf.src %>/helpers/_maps.scss',
          '<%= conf.src %>/helpers/_strings.scss',
          // extend
          '<%= conf.src %>/extend/_chars.scss',
          '<%= conf.src %>/extend/_ascii.scss',
          '<%= conf.src %>/extend/_binary.scss',
          '<%= conf.src %>/extend/_math.scss',
          '<%= conf.src %>/extend/_positional-notation.scss',
          // ciphers
          '<%= conf.src %>/ciphers/_caesar.scss',
          '<%= conf.src %>/ciphers/_caesar-keyed.scss',
          '<%= conf.src %>/ciphers/_rot.scss',
          '<%= conf.src %>/ciphers/_vigenere.scss',
          '<%= conf.src %>/ciphers/_vigenere-keyed.scss',
          '<%= conf.src %>/ciphers/_vigenere-autokey.scss',
          '<%= conf.src %>/ciphers/_xor.scss',
          // codes
          '<%= conf.src %>/codes/_morse.scss',
          // convertions
          '<%= conf.src %>/convertions/_gray-code.scss',
          // cryptanalysis
          '<%= conf.src %>/cryptanalysis/_letter-frequency.scss',
          '<%= conf.src %>/cryptanalysis/_frequency-analysis.scss',
          '<%= conf.src %>/cryptanalysis/_brute-force.scss'
        ],
        dest: '<%= conf.dist %>/_<%= pkg.title %>.scss',
      },
    },

    clean: {
      rebuild: {
        src: [
          'node_modules',
          'ruby',
          'Gemfile.lock',
          '.sass-cache',
          '.bundle'
        ]
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: ['-a'], // '-a' for all files
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'master'
      }
    },

    'gh-pages': {
      options: {
        base: 'test',
        message: 'Update gh-pages',
        push: true
      },
      src: ['index.html', 'img/*', 'css/*']
    }

  });


  grunt.registerTask('test', [
    // 'browserSync:test',
    'watch:test'
  ]);

  grunt.registerTask('dist', [
    'concat:dist',
    'shell:sass:dist'
  ]);

  grunt.registerTask('release', [
    "bump-only",
    "dist",
    "bump-commit"
  ]);

  grunt.registerTask('prefix', [
    'autoprefixer'
  ]);

};
