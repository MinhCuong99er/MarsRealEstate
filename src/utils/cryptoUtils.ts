import crypto from 'crypto'

class Crypto {
  public md5(data) {
    // return crypto.createHash('md5').update(data).digest('hex')
    return crypto.createHash('md5').update(data).digest('base64')
  }

  public md5Npm(data) {
    console.log(`🚀 ~ file: cryptoUtils.ts ~ line 10 ~ Crypto ~ md5Npm ~ data`, data)
    const md5Module = require('md5')
    const sum: string = md5Module(data)
    return sum
  }

  public hmacsha1(data: string, key: string) {
    // return crypto.createHmac('sha1', key).update(data).digest('hex')
    return crypto.createHmac('sha1', key).update(data).digest('base64')
  }

  public base64Encode(value) {
    const buff = Buffer.from(value)
    const base64data = buff.toString('base64')
    return base64data
    // return btoa(value);
  }

  public base64Decode(value) {
    const buff = Buffer.from(value, 'base64')
    const text = buff.toString()
    // const text = buff.toString('utf8');
    return text
    // return atob(value);
  }
}

export const cryptoUtils = new Crypto()
