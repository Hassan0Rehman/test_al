import * as _ from "lodash";
import * as  redis from "redis";
import * as memCache  from "./memcache";
import * as redisCache  from "./redis-cache";
import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";
import * as mapper from "../modules/api-mapper/mapper";


// const publisher  = redis.createClient(6380,
//     "cig-memory.redis.cache.windows.net",
//     {
//         auth_pass: "DI997u5uaw6KHvKiry9M51VJJM7Nwp2dL2pHmDZ7y3E=",
//         tls: {servername: "cig-memory.redis.cache.windows.net"},
//         db: 3
//     }
// );
const subscriber = redis.createClient(6380,
    "cig-memory.redis.cache.windows.net",
    {
        auth_pass: "DI997u5uaw6KHvKiry9M51VJJM7Nwp2dL2pHmDZ7y3E=",
        tls: {servername: "cig-memory.redis.cache.windows.net"},
        db: 3
    }
);

function publish(channel: string, message: any) {
    // publisher.publish(channel, message);
}
function listenChannelWidget() {
    try {
        subscriber.on("message", function(channel: any, message: any) {
            console.log("i am subscriber : " + message);
            let changedComponent = JSON.parse(message);
            if  (changedComponent.name === "renderingContext") {
                memCache.default.delKey(changedComponent.name);
                memCache.default.delKey("home-page-level");
                memCache.default.setCache(changedComponent.name, changedComponent.value);
            } else  {
                changedComponent = mapper.default.map("scheduleWidget", changedComponent);
                const _data = [
                    {title: "Recently Finished", matches: <any>[], val: 0},
                    {title: "Live Cricket", matches: <any>[], val: 1},
                    {title: "Upcoming Matches", matches: <any>[], val: 2}
                  ];
                  _.each(changedComponent, function(match) {
                    if (match.matchState === 0) _data[0].matches.push(match);
                    else if (match.matchState === 1) _data[1].matches.push(match);
                    else if (match.matchState === 2) _data[2].matches.push(match);
                  });
                const _str = ejs.render(fs.readFileSync(path.join(__dirname, "../views/partials/home/schedule-widget.ejs"), "utf8"), {"scheduleWidget": _data});
                memCache.default.delKey("scheduleWidget-isDesktop");
                memCache.default.delKey("scheduleWidget-isMobile");
                memCache.default.delKey("home-page-level-isDesktop");
                memCache.default.delKey("home-page-level-isMobile");
                memCache.default.setCache("scheduleWidget-isDesktop", _str);
                memCache.default.setCache("scheduleWidget-isMobile", _str);
                redisCache.default.setCache("scheduleWidget", _str, {exTime: 86400000});
            }
        });
    } catch (e) {
        console.log("EXCEPTION IN PUB SUB");
        console.log(e);
    }
}
function start() {
    subscriber.subscribe("ChannelWidget");
    listenChannelWidget();
}

export default {
    start: start,
    publish: publish
};
