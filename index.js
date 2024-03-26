const dotenv = require('dotenv');
dotenv.config();

let { app } = require('./app');

const http = require('http');

let server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log('Server Starting Time: ', new Date().toString())
    console.log(`Http Listening on port: ${process.env.PORT || 3000}`);
});
