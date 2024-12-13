const http = require('http');
const { readFileSync } = require('fs');

// Read HTML, CSS, and Image files
const introhtml = readFileSync('./intropage.html', 'utf-8');
const introcss = readFileSync('./intropage.css', 'utf-8');
const abouthtml = readFileSync('./about.html', 'utf-8');
const aboutcss = readFileSync('./about.css', 'utf-8');
const termandconditionhtml = readFileSync('./termandcondition.html', 'utf-8');
const termandconditioncss = readFileSync('./termandcondition.css', 'utf-8');
const contacthtml = readFileSync('./contact.html', 'utf-8');
const contactcss = readFileSync('./contact.css', 'utf-8');

// Function to serve images
const serveImage = (imagePath, contentType, res) => {
    const image = readFileSync(imagePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.write(image);
    res.end();
};

// Create the server
const server = http.createServer((req, res) => {
    console.log('Requested URL:', req.url); // Debugging: Log the requested URL

    // Handle different routes
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(introhtml);
        res.end();
    } else if (req.url === '/intropage.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(introcss);
        res.end();
    }else if (req.url === '/about.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(abouthtml);
        res.end();
    } else if (req.url === '/about.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(aboutcss);
        res.end();
    } else if (req.url === '/termandcondition.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(termandconditionhtml);
        res.end();
    } else if (req.url === '/termandcondition.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(termandconditioncss);
        res.end();
    } else if (req.url === '/contact.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(contacthtml);
        res.end();
    } else if (req.url === '/contact.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(contactcss);
        res.end();
    } else if (req.url === '/resources/nepalflag.avif') {
        serveImage('./resources/nepalflag.avif', 'image/avif', res);
    } else if (req.url === '/resources/DALL%C2%B7E%202024-12-12%2013.11.42%20-%20A%20professional%20and%20modern%20background%20image%20for%20a%20lost%20and%20found%20application.%20The%20design%20should%20feature%20elegant%20abstract%20geometric%20shapes,%20subtle%20faded.webp') {
        serveImage('./resources/DALL·E 2024-12-12 13.11.42 - A professional and modern background image for a lost and found application. The design should feature elegant abstract geometric shapes, subtle faded.webp', 'image/webp', res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>Page not found</h1>');
        res.end();
    }
});

// Start the server
server.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
