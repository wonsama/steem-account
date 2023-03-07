module.exports = {
  apps: [
    {
      name: "steem-account",
      script: "./bin/www",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      cron_restart: "0 * * * *",
    },
  ],
};
