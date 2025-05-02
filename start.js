
const { spawn } = require('child_process');
const path = require('path');

// Start the Express server
const server = spawn('node', [path.join(__dirname, 'src', 'server', 'index.js')], {
  stdio: 'inherit'
});

// Start the Vite dev server
const client = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit'
});

const cleanup = () => {
  server.kill();
  client.kill();
};

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
