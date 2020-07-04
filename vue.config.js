module.exports = {
  devServer: {
    watchOptions: {
      poll: true
    }
  },
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'mystster.redplanner',
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: false
        },
        copyright: 'Copyright 2020 mystster',
        productName: 'RedPlanner',
        generateUpdatesFilesForAllChannels: true,
        publish: {
          releaseType: 'release',
          provider: 'github',
          channel: 'alpha'
        }
      }
    }
  }
};
