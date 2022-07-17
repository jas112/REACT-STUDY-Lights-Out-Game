import React, { Component } from 'react';
import GameSquare from '../gameSquare/GameSquare';
import './GameConsole.css';

class GameConsole extends Component {
    static defaultProps = {
        gameSquaresKeys: [
            'r1c1','r1c2','r1c3','r1c4','r1c5',
            'r2c1','r2c2','r2c3','r2c4','r2c5',
            'r3c1','r3c2','r3c3','r3c4','r3c5',
            'r4c1','r4c2','r4c3','r4c4','r4c5',
            'r5c1','r5c2','r5c3','r5c4','r5c5',
        ]
    };

    constructor(props){
        super(props);
        this.state = {
            isWinner: false,
            isLoser: false,
            isGameOver: false,
            isCurrentSqr: false,
            currSquare: '',
            currAdjSquares: []
        }
        this.registerGameMove = this.registerGameMove.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }

    generateGameSquares(){
        let gameSquares = this.props.gameSquaresKeys.map(sqrId => (
            <GameSquare key={sqrId} id={sqrId} isActive={(sqrId === this.state.currSquare || this.state.currAdjSquares.includes(sqrId)) ? true : false} gameFunction={this.registerGameMove}/>
        ));
        return gameSquares;
    }

    adjacentSquareCheck(sqrId, arr){
        if(this.props.gameSquaresKeys.includes(sqrId)){
            arr.push(sqrId);
            console.log(`potential adjacents: ${arr}`)
        }
    }

    registerGameMove(sqrId){
        console.log(`you clicked: ${sqrId}`);
        this.setState(currState => {
            let newState = {...currState};
            newState.currSquare = sqrId;

            let sqrIdElements = sqrId.split('');
            let row = Number(sqrIdElements[1]);
            let rowPlus = row + 1;
            let rowMinus = row - 1;
            console.log(`row: ${row} | rowPlus: ${rowPlus} | rowMinus: ${rowMinus}`);
            let column = Number(sqrIdElements[3]);
            let columnPlus = column + 1;
            let columnMinus = column - 1;
            console.log(`column: ${column} | columnPlus: ${columnPlus} | columnMinus: ${columnMinus}`);
            let potentialAdjs = [];
            let leftAdj = `r${row}c${columnMinus}`;
            console.log(`leftAdj: ${leftAdj}`);
            this.adjacentSquareCheck(leftAdj, potentialAdjs);
            let rightAdj = `r${row}c${columnPlus}`;
            console.log(`rightAdj: ${rightAdj}`);
            this.adjacentSquareCheck(rightAdj, potentialAdjs);
            let topAdj = `r${rowMinus}c${column}`;
            console.log(`topAdj: ${topAdj}`);
            this.adjacentSquareCheck(topAdj, potentialAdjs);
            let bottomAdj = `r${rowPlus}c${column}`;
            console.log(`bottomAdj: ${bottomAdj}`);
            this.adjacentSquareCheck(bottomAdj, potentialAdjs);
            newState.currAdjSquares = potentialAdjs;
            return newState
        });
    }

    resetGame(){
        this.setState(currState => {
            let newState = {...currState};
            newState.isWinner = false;
            newState.isLoser = false;
            newState.isGameOver = false;
            newState.isCurrentSqr = false;
            newState.currSquare = '';
            newState.currAdjSquares = [];

            return newState;
        });
    }

  render() {
        let currentGameSquares = this.generateGameSquares();
    return (
        <div className='GameConsole'>
            <div className='GameConsole-title'>
                <div className='GameConsole-title-card-1'>Lights</div>
                <div className='GameConsole-title-card-2'>Out</div>
            </div>
            <div className='GameConsole-Display'>
                {currentGameSquares}
            </div>
            <button onClick={this.resetGame} className='GameConsole-reset'>RESET GAME</button>
        </div>
    )
  }
}

export default GameConsole;