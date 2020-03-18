export const RedisConfig = {
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || 'password'
};

export const MysqlConfig = {
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'TEST'
}

export const GlobalConfig = {
  key: 'niiiiii',
  salt: '5a1t',
  jwtExpireTime: 60 * 20
}