module.exports = {
  apps: [
    {
      name: "dragenda",
      script: "npm",
      args: "start",
      cwd: "/www/wwwroot/dragenda.solubiztecnologia.com.br",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      instances: 1,
      exec_mode: "cluster",
      max_memory_restart: "1G",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
