// Runs the built Rocket.Chat bundle under PM2 on the macOS host that serves
// https://rocket-api.forous.com.br. See deploy/pm2/README.md.
const path = require('path');

const HOME = process.env.HOME;
const RUNTIME = process.env.RC_RUNTIME_DIR || path.resolve(__dirname, '../../../Rocket.Chat-runtime');
const PUBLIC_URL = process.env.RC_PUBLIC_URL || 'https://rocket-api.forous.com.br';

module.exports = {
	apps: [
		{
			name: 'rocketchat',
			cwd: `${RUNTIME}/bundle`,
			script: 'main.js',
			interpreter: process.env.RC_NODE_BIN || `${HOME}/.local/share/fnm/node-versions/v24.15.0/installation/bin/node`,
			autorestart: true,
			restart_delay: 10000,
			max_memory_restart: '4G',
			env: {
				NODE_ENV: 'production',
				PORT: '3300',
				ROOT_URL: PUBLIC_URL,
				OVERWRITE_SETTING_Site_Url: PUBLIC_URL,
				MONGO_URL: process.env.RC_MONGO_URL || 'mongodb://127.0.0.1:27017/rocketchat?replicaSet=rs0',
				DEPLOY_METHOD: 'pm2',
				DEPLOY_PLATFORM: 'macos',
			},
		},
	],
};
