export function init() {
    let config = process.env.NODE_ENV === 'production'
        ? require('./environment.prod').config()
        : require('./environment.dev').config();

    // console.log(config);
}
