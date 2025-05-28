module.exports = {
  apps: [
    {
      name: "shikkhok-ai",
      script: "npm",
      args: "start",
      cwd: "/var/www/shikkhok-ai",
      instances: "max",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
