const whitelist = ['https://www.google.com',
        'http://127.0.0.1:3000',
        'http://localhost:5000'
    ] // for access to the backend resource from the front end ,we use the cors and put the domain of the front end in the whiteList
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;