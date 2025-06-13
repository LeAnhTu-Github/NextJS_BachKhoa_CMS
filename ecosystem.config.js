module.exports = {
    apps: [
      {
        name: 'bachkhoa-cms',
        script: 'node_modules/next/dist/bin/next',
        args: 'start',
        instances: 1,
        exec_mode: 'fork',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
          HOST: '192.168.1.12',
          PORT: 5678,
          NEXT_PUBLIC_API_URL: 'http://103.147.34.20:19800/api'
        }
      }
    ]
  }