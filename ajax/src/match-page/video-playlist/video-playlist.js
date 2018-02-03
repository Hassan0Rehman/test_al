
let player = null;
function createPlaylist(videos) {
    if (window.videojs && document.getElementById('bllbyball-clips')) {
        if (!player) {
            player = window.videojs('bllbyball-clips');
        }
        player.playlist && player.playlist(videos) && player.playlist.first();
    }
}

export default {
    createPlaylist: createPlaylist
}