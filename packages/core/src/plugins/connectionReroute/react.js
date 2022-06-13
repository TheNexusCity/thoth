import React, { Component } from 'react';
import Pin from './Pin';

export default class MyReactCompoennt extends Component {
  constructor (props) {
    super(props);
  }
  change () {
    this.setState({
      x: x 
    });
    this.setState({
      y: y 
    });
    this.props.editor.view.connections.get(this.props.connection).update();
  }
  remove () {
    this.props.pins.splice(this.props.pins.indexOf(pin), 1);
    this.props.editor.view.connections.get(this.props.connection).update();
    this.$forceUpdate();
  }
  render () {
    return div;
  }
}
