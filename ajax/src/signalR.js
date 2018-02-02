let gifHub;

const connectHub = function() {
  const url = "https://cig-staging-ops.azurewebsites.net/signalr";
  
  $.connection.hub.url = url;
  gifHub = $.connection.gifHub;
  
  gifHub.client.BroadCastNewBall = function (ball) {
    console.log('BroadCastNewBall');
  };
  
  $.connection.hub.start({ withCredentials: false }).done(function () {
    // matchHub = $.connection.matchHub;

    gifHub.server.joinGroup('16100');
    // matchHub.server.joinGroup('3246');

    console.log("SignalR connected");
  }).fail(function () {
    console.log("connection failed");  
  });
}

export {connectHub};
