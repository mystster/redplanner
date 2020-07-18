module.exports = {
  devServer: {
    watchOptions: {
      poll: true
    }
  },
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      preload: {
        preload: 'src/preload.ts',
        tabBrowserPreload: 'src/tabBrowserPreload.ts'
      },
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
          releaseType: 'prerelease',
          // provider: 's3',
          // bucket: 'test-update',
          // endpoint: 'http://xxxxxxxxxx:9000',
          provider: 'github'
        }
      }
    }
  }
};
