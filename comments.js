// Create web server
// Run it
// Open the browser
// Go to localhost:3000
// Make a request to localhost:3000/comments
// See the results in the browser

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/comments' && method === 'GET') {
    fs.readFile('comments.txt', 'utf8', (err, data) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write('<html><body>');
      res.write('<ul>');
      const comments = data.split('\n');
      for (const comment of comments) {
        res.write(`<li>${comment}</li>`);
      }
      res.write('</ul>');
      res.write('<form action="/comments" method="POST"><input type="text" name="comment"><button type="submit">Add Comment</button></form>');
      res.write('</body></html>');
      return res.end();
    });
  }

  if (url === '/comments' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const comment = parsedBody.split('=')[1];
      fs.appendFile('comments.txt', `${comment}\n`, () => {
        res.statusCode = 302;
        res.setHeader('Location', '/comments');
        return res.end();
      });
    });
  }
});

server.listen(3000);
