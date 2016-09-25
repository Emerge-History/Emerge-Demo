export default {
    env:'test',
    development: {
        db:{
            dialect: 'sqlite',
            storage: './db.development.sqlite'
        },
        port: 3000
    },
    test: {
        db:{
            database: 'demo_test',
            username: 'root',
            password: 'root',
            host: '127.0.0.1',
            port: '3306',
            dialect: 'mysql'
        },
        port: 3000
    },
    production: {
        db:{
            database: 'demo_production',
            username: 'root',
            password: 'root',
            host: '127.0.0.1',
            port: '3306',
            dialect: 'mysql'
        },
        port: 3000
    }
}