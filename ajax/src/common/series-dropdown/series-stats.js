import React, { Component } from 'react';
import * as _ from 'lodash';
import LazyLoad from 'react-lazyload';
import MatchCalculator from '../states-calculator/states-Calculator';

let TopBatsman, SeriesResult, SeriesType;
class SeriesSquad extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            seriesId: document.getElementsByClassName("wrapper-inner")[0].attributes["data-attr-seriesid"].value,
            TopBowler: [],
            flag: 0
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/tours/' + this.state.seriesId + '/series'];
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

        fetch(url, myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (response) {
                    SeriesResult = response;
                    self.fetchTop(response[0].Id);
                });
            }
        })
    }

    fetchTop(seriesId) {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/tours/series/' + seriesId + '/topbatsmen', 'https://cig-prod-api.azurewebsites.net/api/tours/series/' + seriesId + '/topbowlers'];
        //const url = apis[0];
        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
        myHeaders.append('content-type', 'application/json');

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        fetch(apis[0], myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (response) {
                    SeriesType = seriesId;
                    TopBatsman = response;
                    self.fetchTopBowler(seriesId);
                });
            }
        })
    }

    fetchTopBowler(seriesId) {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/tours/series/' + seriesId + '/topbatsmen', 'https://cig-prod-api.azurewebsites.net/api/tours/series/' + seriesId + '/topbowlers'];
        //const url = apis[0];
        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
        myHeaders.append('content-type', 'application/json');

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        fetch(apis[1], myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (response) {
                    if (response.length > 0) {
                        document.getElementById('series-stat-temp').style.display = "none";
                        self.setState({
                            TopBowler: response
                        });
                    } else {
                        document.getElementById('series-stat-temp').style.display = "none";
                        self.setState({
                            flag: 1
                        });
                    }
                });
            }
        })
    }
    

    render() {
        if (this.state.flag == 1) {
            SeriesType = _.get(_.find(SeriesResult, { Id: SeriesType }), 'mt');
            if (SeriesType == 1) {
                SeriesType = "Test"
            } else if (SeriesType == 2) {
                SeriesType = "ODI"
            } else if (SeriesType == 3) {
                SeriesType = "T20"
            } else if (SeriesType == 4) {
                SeriesType = "T10"
            }
            return (
                <div className="right-column">
                    <div className="inline-block">
                        <div className="detail-text">
                            <p className="no-margin-bottom">
                                STATS
                        </p>
                        </div>
                    </div>
                    <div className="inline-block pull-right">
                        <div className="dropdown">
                            <div className="dropdown-toggle" data-toggle="dropdown" type="button" aria-expanded="false">
                                <div className="three-dots"></div>
                            </div>
                            <ul className="dropdown-menu">
                                {SeriesResult.map((series, i) => {
                                    var a;
                                    if (series.mt != null) {
                                        if (series.mt == 1) {
                                            a = "Test"
                                        } else if (series.mt == 2) {
                                            a = "ODI"
                                        } else if (series.mt == 3) {
                                            a = "T20"
                                        } else if (series.mt == 4) {
                                            a = "T10"
                                        }
                                        return (
                                            <li key={series.Id} onClick={() => this.fetchTop(series.Id)}>
                                                <a className={"teamId" + series.Id}>{a}</a>
                                            </li>
                                        );
                                    }
                                })}
                            </ul>
                        </div>
                    </div>
                    <div id="stat-points-table-container" className="no-margin-top">
                        <div className="copy-text"><p id="series-points-title" className="no-margin-bottom">{SeriesType}</p></div>
                        <table className="teams-table stat-points-table">
                            <thead className=""><tr><th className="runs-weight width-150">Most Runs</th><th>Runs</th><th className="padding-left-8">SR</th></tr></thead>
                            <tbody>
                                <tr>
                                    <td colSpan='100%' className="no-squad-response">
                                        No Listed Runs
                                </td>
                                </tr>
                            </tbody>
                            <thead className=""><tr><th className="runs-weight width-150" style={{ paddingTop: '15px' }}>Most Wickets</th><th style={{ paddingTop: '15px' }}>WKTS</th><th className="padding-left-8" style={{ paddingTop: '15px' }}>ECON</th></tr></thead>
                            <tbody>
                                <tr>
                                    <td colSpan='100%' className="no-squad-response">
                                        No Listed Wickets
                                </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
        if (this.state.TopBowler.length == 0 && (SeriesResult == undefined || SeriesResult.length == 0) && (TopBatsman == undefined || TopBatsman.length == 0))
            return null;
        SeriesType = _.get(_.find(SeriesResult, { Id: SeriesType }), 'mt');
        if (SeriesType == 1) {
            SeriesType = "Test"
        } else if (SeriesType == 2) {
            SeriesType = "ODI"
        } else if (SeriesType == 3) {
            SeriesType = "T20"
        } else if (SeriesType == 4) {
            SeriesType = "T10"
        }
        return (
            <div className="right-column">
                <div className="inline-block">
                    <div className="detail-text">
                        <p className="no-margin-bottom">
                            STATS
                        </p>
                    </div>
                </div>
                <div className="inline-block pull-right">
                    <div className="dropdown">
                        <div className="dropdown-toggle" data-toggle="dropdown" type="button" aria-expanded="false">
                            <div className="three-dots"></div>
                        </div>
                        <ul className="dropdown-menu">
                            {SeriesResult.map((series, i) => {
                                var a;
                                if (series.mt != null) {
                                    if (series.mt == 1) {
                                        a = "Test"
                                    } else if (series.mt == 2) {
                                        a = "ODI"
                                    } else if (series.mt == 3) {
                                        a = "T20"
                                    } else if (series.mt == 4) {
                                        a = "T10"
                                    }
                                    return (
                                        <li key={series.Id} onClick={() => this.fetchTop(series.Id)}>
                                            <a className={"teamId" + series.Id}>{a}</a>
                                        </li>
                                    );
                                }
                            })}
                        </ul>
                    </div>
                </div>
                <div id="stat-points-table-container" className="no-margin-top">
                    <div className="copy-text"><p id="series-points-title" className="no-margin-bottom">{SeriesType}</p></div>
                    <table className="teams-table stat-points-table">
                        <thead className=""><tr><th className="runs-weight width-150">Most Runs</th><th>Runs</th><th className="padding-left-8">SR</th></tr></thead>
                        <tbody>
                            {
                                TopBatsman.map((batsman, i) => {
                                    return (
                                        <tr>
                                            <td className="player-row">
                                                <div className="player-pic">
                                                    {<LazyLoad height={35}><img className="rounded" height="30" width="30" src={"https://d7d7wuk1a7yus.cloudfront.net/player-images/" + batsman.Id + ".png"} onError={(e)=>{e.target.src="https://d7d7wuk1a7yus.cloudfront.net/user-images/0.png"}} /></LazyLoad>}
                                                </div>
                                                <div>
                                                    <div className="player-name">{batsman.n.split(' ')[0].substring(0, 1) + ". " + batsman.n.split(' ')[1]}</div>
                                                    <div className="player-description">{batsman.tni}</div>
                                                </div>
                                            </td>

                                            <td className="team-row-runs">{batsman.r}</td>
                                            <td className="team-row-sr padding-left-8">{MatchCalculator.CalculateSR(batsman.b, batsman.r)}</td>

                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                        <thead className=""><tr><th className="runs-weight width-150" style={{ paddingTop: '15px' }}>Most Wickets</th><th style={{ paddingTop: '15px' }}>WKTS</th><th className="padding-left-8" style={{ paddingTop: '15px' }}>ECON</th></tr></thead>
                        <tbody>
                            {this.state.TopBowler.map((result, i) => {
                                return (
                                    <tr>
                                        <td className="player-row">
                                            <div className="player-pic">
                                                {<LazyLoad height={35}><img className="rounded" height="30" width="30" src={"https://d7d7wuk1a7yus.cloudfront.net/player-images/" + result.Id + ".png"} onError={(e)=>{e.target.src="https://d7d7wuk1a7yus.cloudfront.net/user-images/0.png"}}/></LazyLoad>}
                                            </div>
                                            <div>
                                                <div className="player-name">{result.n.split(' ')[0].substring(0, 1) + ". " + result.n.split(' ')[1]}</div>
                                                <div className="player-description">{result.tni}</div>
                                            </div>
                                        </td>
                                        <td className="team-row-runs">{result.w}</td>
                                        <td className="team-row-sr padding-left-8">{MatchCalculator.CalculateEconByBalls(result.b, result.r)}</td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default SeriesSquad;
