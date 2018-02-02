import React, { Component } from 'react';
import * as _ from 'lodash';
import LazyLoad from 'react-lazyload';

let SeriesType, SeriesResult;
class SeriesSquad extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            seriesId: document.getElementsByClassName("wrapper-inner")[0].attributes["data-attr-seriesid"].value,
            pools: []
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
                    self.fetchPools(response[0].Id);
                });
            }
        })
    }

    fetchPools(seriesId) {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/tours/series/' + seriesId + '/pools'];
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
                    SeriesType =response[0].t;
                    self.setState({
                        pools: response[0].pt
                    });
                });
            }
        })
    }

    render() {
        if (this.state.pools.length == 0 && (SeriesResult == undefined || SeriesResult.length == 0))
            return null;
        return (
            <div className="right-column">
                <div className="inline-block">
                    <div className="detail-text">
                        <p className="no-margin-bottom">
                            Points Table
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
                                    <li key={series.Id} onClick={() => this.fetchPools(series.Id)}>
                                        <a className={"teamId" + series.Id}>{a}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div id="pool-points-table-container" className="no-margin-top">
                    <div className="copy-text"><p id="series-points-title" className="no-margin-bottom">{SeriesType}</p></div>
                    <table className="most-wickets teams-table">
                        <thead className=""><tr><th class="runs-weight">Teams</th><th>P</th><th>W</th><th>L</th><th>D</th></tr></thead>
                        <tbody>
                            {this.state.pools.map((result, i) => {
                                return (
                                    <tr>
                                        <td class="team-flag">
                                            <div class="team-row">
                                                <span style={{marginLeft:'15px'}}>{result.tni}</span>
                                                <div class="team-row-flag-default float-left">
                                                    {<LazyLoad height={35}><img height="30" width="30" src={"https://d7d7wuk1a7yus.cloudfront.net/team-images/100x100/" + result.tn.replace(/\s+/g, "").toLowerCase() + ".png"} /></LazyLoad>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{result.p}</td>
                                        <td>{result.w}</td>
                                        <td>{result.l}</td>
                                        <td>{result.d}</td>
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
