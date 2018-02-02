import React, { Component } from 'react';
import * as _ from 'lodash';

class RankingsApp extends Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
      activeSeries: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const self = this;
    const apis = ['https://cig-prod-api.azurewebsites.net/api/tours/active/all'];
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
        response.json().then(function(series) {
          const arr = series;
          
          self.setState({
            activeSeries: arr
          });
        });
      }  
    })
  }

  render() {
    return (
        <div>
            {this.state.activeSeries.map((series, i) => {
                return (
                    <div key={i+1} className="width-100 dropdown-tab series-dropdown-truncate" title={"series.t"}>
                        <a className="margin-10 news-link ajax-link" href={"/series/" + series.Id + "/" + series.t.split(' ').join('-')}>
                            { series.t }
                        </a>
                    </div>
                );
            })}
        </div>
    );
  }
}

export default RankingsApp;
