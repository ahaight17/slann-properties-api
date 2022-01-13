module.exports = {
	apps: [{
		name: 'Slann Properties',
		script: './server/server.js',
		node_args: '-r dotenv/config',
	}],
}
