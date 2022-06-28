const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    let token = jwt.sign({ id }, process.env.COOKIE_SECRET, { noTimestamp: true, expiresIn: '2d' });
    return token
}

module.exports = generateToken