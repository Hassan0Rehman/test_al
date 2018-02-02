

import React, { Component } from 'react';

class FeatureArticle extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            seriesId: this.props.seriesId,
            latestMatch: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/tours/' + this.state.seriesId + '/match/latest'];
        const url = apis[0];
        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Token HHiQLYvZnkGqfD5xzxr/Sw');
        myHeaders.append('content-type', 'application/json');

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        fetch(url, myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (response) {
                    self.setState({
                        latestMatch: response
                    });
                });
            }
        })
    }

    render() {

        if (this.state.latestMatch.length == 0)
            return null;
        const obj = this.state.latestMatch;

        let template = null;

        if (obj.ms == 0) {
            template = <a href={"/match/" + obj.mid}> <p style={{ color: 'red' }}>{obj.mr}</p></a>
        }
        else if (obj.ms == 1) {
            var team1Score = obj.t1i1s;
            var team2Score = obj.t1i2s;

            if (team1Score === "") {
                team1Score = "0/0 (0.0)";
            }
            else if (obj.t1i2s !== "") {
                team1Score += " & " + obj.t1i2s + " (" + obj.t1i2o + ")";
            } else {
                team1Score += " (" + obj.t1i1o + ")";
            }

            if (team2Score === "") {
                team2Score = "0/0 (0.0)";
            }
            else if (obj.t2i2s !== "") {
                team2Score += " & " + obj.t2i2s + " (" + obj.t2i2o + ")";
            } else {
                team2Score += " (" + obj.t2i1o + ")";
            }

            template =
                <a href={"/match/" + obj.mid}>
                    <p class="inline"> Live </p>
                    <p class="inline">{obj.t1n + " " + team1Score} </p>
                    <p class="inline"> {obj.t2n + " " + team2Score} </p>
                </a>
        }
        else if (obj.ms == 2) {
            var months = new Array();
            months[0] = "January";
            months[1] = "February";
            months[2] = "March";
            months[3] = "April";
            months[4] = "May";
            months[5] = "June";
            months[6] = "July";
            months[7] = "August";
            months[8] = "September";
            months[9] = "October";
            months[10] = "November";
            months[11] = "December";

            const date = new Date(obj.md).getDate();
            const month = new Date(obj.md).getMonth();
            template = <a href={"/match/" + obj.mid}><p style={{ color: 'red' }}> Upcoming {obj.mh + " " + date + " " + months[month]}</p></a>
        }

        return template;
    }
}

export default FeatureArticle;
