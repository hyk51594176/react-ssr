module.exports = {
  apps: [
    {
      script: './scripts/server.js',
      watch: '.',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
