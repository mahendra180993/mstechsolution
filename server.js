// Simple local development server with Netlify-style redirects
// Run with: node server.js
// Then visit: http://localhost:3000

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Redirect rules (matching Netlify config)
const redirects = {
  '/': '/index.html',
  '/about': '/about.html',
  '/services': '/services.html',
  '/projects': '/projects.html',
  '/faq': '/faq.html',
  '/contact': '/contact.html'
};

// Permanent redirects (301)
const permanentRedirects = {
  '/index.html': '/',
  '/about.html': '/about',
  '/services.html': '/services',
  '/projects.html': '/projects',
  '/faq.html': '/faq',
  '/contact.html': '/contact'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle permanent redirects first
  if (permanentRedirects[pathname]) {
    res.writeHead(301, { 'Location': permanentRedirects[pathname] });
    res.end();
    return;
  }

  // Handle rewrites (200)
  if (redirects[pathname]) {
    pathname = redirects[pathname];
  }

  // Remove leading slash for file system
  let filePath = pathname === '/' ? '/index.html' : pathname;
  if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
  }

  // Default to index.html if no extension
  if (!path.extname(filePath)) {
    filePath = filePath + '.html';
  }

  // Security: prevent directory traversal
  filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');

  const fullPath = path.join(__dirname, filePath);

  // Check if file exists
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found, try as directory with index.html
      if (pathname.endsWith('/')) {
        const indexPath = path.join(__dirname, pathname.substring(1), 'index.html');
        fs.access(indexPath, fs.constants.F_OK, (err2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
          } else {
            serveFile(indexPath, res);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      }
    } else {
      serveFile(fullPath, res);
    }
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf'
  };

  const contentType = contentTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

server.listen(PORT, () => {
  console.log(`\n🚀 Local development server running at:`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log(`📝 Clean URLs are now working:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/about`);
  console.log(`   http://localhost:${PORT}/services`);
  console.log(`   http://localhost:${PORT}/projects`);
  console.log(`   http://localhost:${PORT}/faq`);
  console.log(`   http://localhost:${PORT}/contact\n`);
});
