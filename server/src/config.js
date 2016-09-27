export default {
    env:'development',
	mail: {
        service: 'QQ',
        auth: {
        user: '627290897@qq.com',
        pass: 'hjtabc110'
        }
        // service: 'outlook',
        // auth: {
        //   user: 'rina.tang@emerge.cc',
        //   pass: 'tang899.'
        // }
	},
    secret: 'shhhhhhared-secret',
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