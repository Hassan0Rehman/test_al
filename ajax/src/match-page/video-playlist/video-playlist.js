
function createPlaylist(videos) {
    if (window.videojs) {
        const player = window.videojs('bllbyball-clips');
        player.playlist(videos);
        player.playlist.autoadvance(0);
    }
}

export default {
    createPlaylist: createPlaylist
}