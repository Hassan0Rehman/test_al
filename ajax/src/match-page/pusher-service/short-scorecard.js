import Pusher from 'pusher-js';

var channel = null;

function setChannel(matchId) {
    var pusher = new Pusher('dc33ee6aa59a37861727', {
        cluster: 'ap2',
        encrypted: true
    });
      
    channel = pusher.subscribe('v4-LiveScore-' + matchId);
}

function getChannel() {
    return channel;
}

function subscribeShortScoreCard(callback) {
    if (channel) channel.bind('ScoreUpdate', callback);
}

function subscribeBallUpdate(callback) {
    if (channel) channel.bind('BallUpdate', callback);
}

function gifUpdate(callback) {
    if (channel) channel.bind('GifUpdate', callback);
}

function vidUpdate(callback) {
    if (channel) channel.bind('VidUpdate', callback);
}

export default {
    subscribeShortScoreCard: subscribeShortScoreCard,
    subscribeBallUpdate: subscribeBallUpdate,
    gifUpdate: gifUpdate,
    vidUpdate: vidUpdate,
    setChannel: setChannel,
    getChannel: getChannel
};
