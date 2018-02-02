import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';

class Timer extends Component {
  constructor(props) {
    super(props);
    const current = new Date().valueOf();
    this.state = {
      secondsRemaining: this.props.secondsRemaining - current
    };
  }

  tick() {
    this.setState({secondsRemaining: this.state.secondsRemaining - 1000});
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
    }
  };

  componentDidMount() {
    this.setState({ secondsRemaining: this.state.secondsRemaining });
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const duration = moment.duration(this.state.secondsRemaining);
    const days = duration.days().toString().length <= 1 ? '0' + duration.days() : duration.days();
    const hours = duration.hours().toString().length <= 1 ? '0' + duration.hours() : duration.hours();
    const minutes = duration.minutes().toString().length <= 1 ? '0' + duration.minutes() : duration.minutes();
    const seconds = duration.seconds().toString().length <= 1 ? '0' + duration.seconds() : duration.seconds();
    return (days + ' days ' + hours + ':' + minutes + ':' + seconds);
  }
}

export default Timer;
