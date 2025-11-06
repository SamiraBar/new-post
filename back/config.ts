import path from "path";

const config = {
    publicPath: path.join(__dirname, 'public'),
    db: 'mongodb://localhost/new-post',
};

export default config;