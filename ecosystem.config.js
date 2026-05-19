// PM2 ecosystem config for Viewcake
// Usage:
//   First start:  pm2 start ecosystem.config.js
//   Routine restart (preserves existing process): pm2 restart viewcake
//   Save process list: pm2 save

module.exports = {
  apps: [
    {
      name: "viewcake",
      cwd: "/var/www/viewcake",
      script: "npm",
      args: "start -- -p 3020",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
