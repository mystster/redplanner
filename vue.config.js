module.exports = {
  devServer: {
    watchOptions: {
      poll: true
    }
  },
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false
    }
  }
};
