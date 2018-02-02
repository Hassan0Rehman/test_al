import * as  redis from "redis";
import * as bluebird from "bluebird";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(6380,
    "cig-memory.redis.cache.windows.net",
    {
        auth_pass: "DI997u5uaw6KHvKiry9M51VJJM7Nwp2dL2pHmDZ7y3E=",
        tls: {servername: "cig-memory.redis.cache.windows.net"},
        db: 3
    }
);

// client.on("error", function (err: any) {
//     console.log("REDIS CONNECTION ___ Error " + err);
// });

function _setCache(key: string, value: any, options: any) {
    // client.set(key, value, "EX", options.exTime);
}

function _getCache(key: string, callback: any) {
    return client.getAsync(key).then(callback);
}

export default {
    setCache: _setCache,
    getCache: _getCache
};
