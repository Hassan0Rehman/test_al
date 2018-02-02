import React, { Component } from 'react';
import * as _ from 'lodash';
const ReactHighcharts = require('react-highcharts');

const highchartConfigurations = {
    global: {
        useUTC: false
    },
    chart: {
        type: 'spline',
        animation: ReactHighcharts.svg, // don't animate in old IE
        renderTo: 'container',
        events: {
        }
    },
    title: {
        text: 'Worm'
    },
    colors: ['red', 'green', 'orange', 'blue'],
    xAxis: {
        type: 'linear',
        title: 'Overs'
    }, yAxis: [{
        title: 'Runs',
        type: 'linear',
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    }], 
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
            this.y + ' runs in <br/>' +
            this.x + '.0 overs';
        }
    }, legend: {
        enabled: true
    }, exporting: {
        enabled: false
    }
};

class WormChartApp extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            config: {}
        };
    }

    componentWillMount() {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/matches/'+ self.props.id +'/chart'];
        const url = apis[0];
        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
        myHeaders.append('content-type', 'application/json');

        var myInit = { 
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default' 
        };

        fetch(url, myInit).then(function(response) {
            if (response.status === 200) {
                response.json().then(function(data) {
                    const chartConfig = _.extend(highchartConfigurations, {series: self.getChart(data)});
                    self.setState({
                        config: chartConfig
                    });
                });
            }  
        });
    }

    getChart(matchChart) {
        let seriesArray = new Array(), title = '', count = 1;
        for (var key in matchChart.allNodes) {
            if (count == 1)
                title = '1st Innings';
            if (count == 2)
                title = '2nd Innings';
            if (count == 3)
                title = '3rd Innings';
            if (count == 4)
                title = '4th Innings';
            var data = [], i, j;
            let jArray = matchChart.allNodes[key];
            _.each(jArray, function (node, i) {
                data.push({ x: parseInt(node.OverNum), y: parseInt(node.MatchScore.split('/')[0]) })
            });
            seriesArray.push({ name: title, data: data });
            count++;
        }
        return seriesArray;
    }

    render() {
        return <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>;
    }
}

export default WormChartApp;
