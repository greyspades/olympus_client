module.exports = {
    apps: [
      {
        name: 'Recruitment',
        exec_mode: 'cluster',
        instances: '2', // Or a number of instances
        script: 'node_modules/next/dist/bin/next',
        args: 'start',
        env_local: {
          APP_ENV: 'local',
          IP: '192.168.1.28',
          PORT: '7443' // Production use
        },
        env_development: {
          APP_ENV: 'dev',
          PORT: '7442' // 
        },
        env_production: {
          APP_ENV: 'prod',
          IP: '192.168.1.28',
          PORT: '7441' // Just for refernce.
        }
      }
    ]
  };
  