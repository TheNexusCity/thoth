import React, { Component } from 'react';
import Pin from './Pin';

// convert the above vue pug template to a react component
// Language: typescript and react
const pinTemplate = ({pin}) => {
  return (
    <div className="pin"
      style={{left: pin.x+'px', top: pin.y+'px'}}
      onPointerDown={this.down}
      onPointerUp={this.pinup}
    />
  )
}

export default function Pins (props) {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  change () {
    setX(x)
    setY()
    this.props.editor.view.connections.get(this.props.connection).update();
  }
  remove () {
    this.props.pins.splice(this.props.pins.indexOf(pin), 1);
    this.props.editor.view.connections.get(this.props.connection).update();
    this.$forceUpdate();
  }
  render () {
    return pinTemplate({{x, y}});
  }
}
