const redis = require('redis')
const REDIS_CONF = require('../config/redis')

const redisClient = redis.createClient({
  host: REDIS_CONF.host,
  port: REDIS_CONF.port
})

redisClient.on('error', err => {
  console.log('err: ', err)
})

module.exports = redisClient
