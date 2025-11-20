const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@store': path.resolve(__dirname, 'src/store'),
            '@app-types': path.resolve(__dirname, 'src/types'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@google': path.resolve(__dirname, 'src/google'),
        },
    },
};
