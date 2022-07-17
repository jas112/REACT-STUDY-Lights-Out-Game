import React, { Component } from 'react';
import './GameSquare.css';

class GameSquare extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        console.log(`clicking square: ${this.props.id}`)
        this.props.gameFunction(this.props.id);
    }
  render() {
    return (
      <div className={this.props.isActive ? `GameSquare GameSquare-active` : `GameSquare`} onClick={this.handleClick}></div>
    )
  }
}

export default GameSquare;