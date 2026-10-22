const server = require('./server');

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`🚀 Grapsyh Sunucusu port ${PORT} üzerinde hazır!`);
    });
}

module.exports = server;
