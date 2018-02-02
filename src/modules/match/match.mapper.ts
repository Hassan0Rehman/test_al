import * as _ from "lodash";

const components: any = {
    scorecard: {
        bt: "battingTeam",
        ai: "allInns",
        b1f: "b1f",
        b1r: "batsman1Runs",
        b1n: "batsman1Name",
        bt1b: "batsman1Balls",
        b14s: "batsman14s",
        b16s: "batsman16s",
        b1sr: "batsman1Sr",
        b2f: "b2f",
        bt2r: "batsman2Runs",
        bt2n: "batsman2Name",
        bt2b: "batsman2Balls",
        bt24s: "batsman24s",
        bt26s: "batsman26s",
        bt2sr: "batsman2Sr",
        b1b: "b1b",
        bw1n: "bowler1Name",
        bw1o: "bowler1Overs",
        bw1m: "bowler1Maidens",
        bw1r: "bowler1Runs",
        bw1w: "bowler1Wickets",
        bw1e: "bowlers1Econ",
        b2b: "b2b",
        b2n: "bowler2Name",
        b2o: "bowler2Overs",
        b2m: "bowler2Maidens",
        b2r: "bowler2Runs",
        b2w: "bowler2Wickets",
        b21e: "bowler21Econ",
        rr: "runsRequired",
        fo: "fromOvers",
        sr: "showRequired",
        nf: "newsFlash",
        sct: "sct",
        sst: "sst",
        sm: "smallScorecard",
        cs: "closingComment",
        iid: "inningsId"
    }, matchOverview: {
        id: "id",
        mr: "matchReport",
        to: "toss",
        um: "umpires",
        re: "referee",
        pi: "pitch",
        we: "weather",
        hu: "humidity",
        te: "temperature",
        mi: "matchId",
        moi: "MOTMId",
        mon: "MOTMName",
        mot: "MOTMTeam",
        st: "SeriesTitle",
        u: "Umpire",
        r: "Umpirerefere",
        t: "UmpireTv",
        ti: "SeriesId",
        tt: "SeriesLinkTitle"
    }
};
function map(partialName: string, response: any) {
    if (_.get(components[partialName], "length") > 0) {
        const map = _.get(components[partialName], "0");
        return _.map(response, function(match, i) {
            return _.mapKeys(match, function(value, key) {
                return map[key];
            });
        });
    } else {
        const map = _.get(components, partialName);
        return _.mapKeys(response, function(value, key) {
            return map[key];
        });
    }
}

export default <any> {
    map: map
};
