module.exports = {
  port: 8000,
  nodeResolve: true,
  preserveSymlinks: true,
  http2: true,
  appIndex: 'index.html',
  sslCert: './certs/localhost.crt',
  sslKey: './certs/localhost.key'
};
