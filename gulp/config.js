var dest = "./build";
var src = './src';

module.exports = {
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src]
    },
    files: [
      dest + "/**",
      // Exclude Map files
      "!" + dest + "/**.map"
    ]
  },
  less: {
    src: src + "/assets/less/*.{less,css}",
    dest: dest + "/assets/css"
  },
  images: {
    src: src + "/assets/images/**",
    dest: dest + "/assets/images"
  },
  markup: {
    src: src + "/**.html",
    dest: dest
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    extensions: ['.coffee', '.hbs'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
        entries: src + '/assets/js/index.js',
        dest: dest + '/assets/js',
        outputName: 'index.js'
      }//, {
    //   entries: src + '/javascript/head.coffee',
    //   dest: dest,
    //   outputName: 'head.js'
    // }
    ]
  }
};
