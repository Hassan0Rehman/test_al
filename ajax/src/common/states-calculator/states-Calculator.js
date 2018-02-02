function calculateRR(overs, score) {
    var rr; var ratio;
    try {
      var balls = overs.split('.').length > 1 ? overs.split('.')[1] : '0';
      ratio = 0;
      if (balls > 0)
        ratio = balls / 6;
      else
        ratio = 0;
      rr = (parseInt(score) / (parseInt(overs.split('.')[0]) + ratio));
    } catch (e) {
      rr = 0.00;
    }
    if (!rr) rr = 0.00;
    return rr.toFixed(2);
  }


  function CalculateSR(balls, runs) {
    try {
        var batSR = parseInt(runs) / parseInt(balls);
        batSR = (parseFloat(batSR) * parseFloat(100)).toFixed(2);
        if (isNaN(batSR))
            batSR = 0.00;
    }
    catch (e) {
        return "-";
    }
    return batSR;
}

function CalculateEcon(overs, runs) {
    try {
        var balls = parseInt(overs.split('.')[0] * 6) + parseInt(overs.split('.')[1]);
        var bowlEcon = parseInt(runs) / parseInt(balls);
        bowlEcon = parseFloat(bowlEcon) * parseFloat(6);
        bowlEcon = bowlEcon.toFixed(2);
        if (isNaN(bowlEcon))
            bowlEcon = "0.00";
    }
    catch (e) {
        return "-";
    }
    return bowlEcon;
}

function CalculateEconByBalls(balls, runs) {
    try {
        var bowlEcon = parseInt(runs) / parseInt(balls);
        bowlEcon = parseFloat(bowlEcon) * parseFloat(6);
        bowlEcon = bowlEcon.toFixed(2);
        if (isNaN(bowlEcon))
            bowlEcon = "0.00";
    }
    catch (e) {
        return "-";
    }
    return bowlEcon;
}


export default {
    calculateRR: calculateRR,
    CalculateSR: CalculateSR,
    CalculateEcon: CalculateEcon,
    CalculateEconByBalls: CalculateEconByBalls
};