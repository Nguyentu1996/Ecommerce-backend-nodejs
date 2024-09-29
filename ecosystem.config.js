module.exports = {
    apps: [
      {
        name: 'backend-node-app',
        script: './server.js',
        instances: 'max',  // Tự động phân chia giữa các CPU cores
        // exec_mode: 'cluster', // Chạy trong chế độ cluster
        watch: true, // Tự động khởi động lại khi có thay đổi
        env: {
          NODE_ENV: 'dev',
        },
        env_production: {
          NODE_ENV: 'pro',
        },
      },
    ],
  };