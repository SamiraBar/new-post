import path from "path";

export const secret = "admin_potato_secret"

const config = {
    publicPath: path.join(__dirname, 'public'),
    db: 'mongodb://localhost/new-post',
};

export default config;