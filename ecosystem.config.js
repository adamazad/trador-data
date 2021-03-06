const sharedAppConfig = {
  namespace: 'trador',
  instances: 2,
  exec_mode: 'cluster',
  env: {
    NODE_ENV: 'development',
  },
  env_production: {
    NODE_ENV: 'production',
  },
  node_args: '-r ts-node/register -r tsconfig-paths/register',
  args: '--color',
};

module.exports = {
  apps: [
    {
      ...sharedAppConfig,
      name: 'trador-api-servers',
      script: './build/servers/api-server/index.js',
    },
    {
      ...sharedAppConfig,
      name: 'trador-auth-server',
      script: './build/servers/auth-server/index.js',
    },
  ],
};
