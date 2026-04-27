module.exports = {
  apps: [
    {
      name: "express-app",

      // Entry point of your app
      script: "./src/server.js",

      // Run mode
      instances: 1,          // keep 1 for now (safe)
      exec_mode: "fork",     // simple mode (stable)

      // Auto restart if crash
      autorestart: true,

      // Restart if memory > 1GB
      max_memory_restart: "1G",

      // Logs
      error_file: "./logs/error.log",
      out_file: "./logs/output.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      
      env: {
        PORT: 3000
      }
    }
  ]
};