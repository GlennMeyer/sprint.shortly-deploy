module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      /* START SOLUTION */
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/client/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
      /* END SOLUTION */
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      /* START SOLUTION */
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
      /* END SOLUTION */
    },

    jshint: {
      files: [
        /* START SOLUTION */
        'Gruntfile.js',
        'app/**/*.js',
        'public/**/*.js',
        'lib/**/*.js',
        './*.js',
        'spec/**/*.js'
        /* ELSE
        // Add filespec list here
        END SOLUTION */
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      /* START SOLUTION */
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'public/dist/style.min.css': 'public/style.css'
        }
      }
      /* END SOLUTION */
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        /* START SOLUTION */
        command: 'git push azure master',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
        /* END SOLUTION */
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    /* START SOLUTION */
    'jshint',
    /* END SOLUTION */
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    /* START SOLUTION */
    'concat',
    'uglify',
    'cssmin'
    /* END SOLUTION */
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      /* START SOLUTION */
      grunt.task.run([ 'shell:prodServer' ]);
      /* ELSE
      // add your production server task here
      END SOLUTION */
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    /* START SOLUTION */
    'test',
    'build',
    'upload'
    /* ELSE
    // add your deploy tasks here
    END SOLUTION */
  ]);


};
