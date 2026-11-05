// Minimal mock Jira Cloud server for testing gajira-login.
// Usage: node mock-jira.js <port> <status> <logfile>
const http = require('http')
const fs = require('fs')

const port = parseInt(process.argv[2] || '8080', 10)
const status = parseInt(process.argv[3] || '200', 10)
const logFile = process.argv[4] || '/tmp/mock-jira.log'

http.createServer((req, res) => {
  fs.appendFileSync(logFile, JSON.stringify({
    method: req.method,
    url: req.url,
    authorization: req.headers.authorization || '',
  }) + '\n')
  if (req.url.startsWith('/rest/api/2/myself') && status === 200) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ accountId: 'abc123', emailAddress: 'user@example.com', displayName: 'Test User' }))
    return
  }
  res.writeHead(status === 200 ? 404 : status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ errorMessages: ['denied'] }))
}).listen(port, '127.0.0.1', () => {
  fs.writeFileSync(logFile + '.ready', 'ok')
})
