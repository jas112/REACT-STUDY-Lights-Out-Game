import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';
import React, { Component } from 'react';
import GameSquare from '../gameSquare/GameSquare';
import './GameConsole.css';

class GameConsole extends Component {
    static defaultProps = {
        boardDimension: 5,
        isActiveProbability: 0.25
    };

    constructor(props){
        super(props);
        this.state = {
            gameBoardDetails: this.generateBoard(),
            isWinner: false,
        }
        this.registerGameMove = this.registerGameMove.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }

    generateBoard(){

        let limit = this.props.boardDimension + 1;
        let sqrStatusValues = [true, false];
        let board = {};

        for (let row = 1; row < limit; row++) {
            for (let col = 1; col < limit; col++) {

                let sqrId = `r${row}c${col}`;
                let keyValue = `${row}-${col}`;
                let isActive;

                let randomFactor = 1 - Math.random();
                // console.log(`randomFactor => ${randomFactor}`);

                if (randomFactor > this.props.isActiveProbability) {
                    isActive = true;
                } else {
                    isActive = false;
                }

                board[sqrId] = {'sqrId': sqrId, 'keyValue': keyValue, 'row': row, 'column': col, 'isActive': isActive};
            }
        }

        return board;

    }

    generateGameBoardElements(){

        let registry = Object.keys(this.state.gameBoardDetails);
        let sqrDimension = (100/this.props.boardDimension) - 3;

        let gameSquares = registry.map(sqr => (
            <GameSquare
                key={this.state.gameBoardDetails[sqr].keyValue}
                id={this.state.gameBoardDetails[sqr].sqrId}
                isActive={this.state.gameBoardDetails[sqr].isActive}
                styleDim={sqrDimension}
                gameFunction={this.registerGameMove}
            />
        ));

        return gameSquares;
    }

    generateAdjacentSquares(potentialSqrsArr){

        let adjacentSqrs = [];

        potentialSqrsArr.forEach((sqrId) => {
            if(this.state.gameBoardDetails.hasOwnProperty(sqrId)){
                adjacentSqrs.push(sqrId);
            }
        });

        // console.log(`adjacentSqrs: ${adjacentSqrs}`);

        return adjacentSqrs;
    }

    getWinnerStatus(){
        return (
            <div>
                <div className='GameConsole-gameStatus GameConsole-winner-ff4500'>WINNER!!!</div>
                <div className='GameConsole-gameStatus GameConsole-winner-0195ff'>WINNER!!!</div>
                <div className='GameConsole-gameStatus GameConsole-winner-ff4500'>WINNER!!!</div>
                <div className='GameConsole-gameStatus GameConsole-winner-0195ff'>WINNER!!!</div>
            </div>
            
        )
    }

    determineAdjacents(sqrId){

        let potentialAdjacentSqrs = [];

        let sqrIdElements = sqrId.split('');

        let row = Number(sqrIdElements[1]);
        let rowPlus = row + 1;
        let rowMinus = row - 1;
        // console.log(`row: ${row} | rowPlus: ${rowPlus} | rowMinus: ${rowMinus}`);

        let column = Number(sqrIdElements[3]);
        let columnPlus = column + 1;
        let columnMinus = column - 1;
        // console.log(`column: ${column} | columnPlus: ${columnPlus} | columnMinus: ${columnMinus}`);

        let leftAdj = `r${row}c${columnMinus}`;
        potentialAdjacentSqrs.push(leftAdj);

        let rightAdj = `r${row}c${columnPlus}`;
        potentialAdjacentSqrs.push(rightAdj);

        let topAdj = `r${rowMinus}c${column}`;
        potentialAdjacentSqrs.push(topAdj);

        let bottomAdj = `r${rowPlus}c${column}`;
        potentialAdjacentSqrs.push(bottomAdj);

        let adjacents = this.generateAdjacentSquares(potentialAdjacentSqrs);

        return adjacents;

    }

    isGameBoardClear(gameboard){

        let markerTotal = 0;
        let targetValue = Object.keys(gameboard).length;

        // console.log(`targetValue => ${targetValue}`);

        for (const sqr in gameboard) {
            if (!gameboard[sqr].isActive) {
                markerTotal+=1; 
                // console.log(`markerTotal => ${markerTotal}`);
            }
        }

        if (markerTotal === targetValue) {
            return true;
        } else {
            return false;
        }

    }

    flipSwitch(arr){

        let flipResults = {...this.state.gameBoardDetails};

        arr.forEach(sqrId => {

            let before = flipResults[sqrId].isActive;

            flipResults[sqrId].isActive = !flipResults[sqrId].isActive;

            let after = flipResults[sqrId].isActive;

            // console.log(`flipping switch ... square ${sqrId} from: ${before} to: ${after}`);

        });

        let gameStatus = this.isGameBoardClear(flipResults);

        return [flipResults, gameStatus];
    }

    registerGameMove(sqrId){
        
        // console.log(`Game move detected... you clicked: ${sqrId}`);

        let adjSquares = this.determineAdjacents(sqrId);

        let flipThese = [sqrId, ...adjSquares];

        let newGameBoardDetailsAndStatus = this.flipSwitch(flipThese);

        let newGameBoardDetails = newGameBoardDetailsAndStatus[0];
        let newGameStatus = newGameBoardDetailsAndStatus[1];

        // console.log(`Are you a winner? => ${newGameStatus.toString()}`);

        this.setState({gameBoardDetails: newGameBoardDetails, isWinner: newGameStatus});
        
    }

    resetGame(){
        this.setState(currState => {

            let newState = {...currState};

            newState.gameBoardDetails = this.generateBoard();
            newState.isWinner = false;

            return newState;
        });
    }

  render() {

        // console.log(`rendering GameConsole...`);

        let currentGameBoard = this.generateGameBoardElements();

        let gameStatus = this.getWinnerStatus();

    return (
        <div className='GameConsole'>
            <div className='GameConsole-title'>
                <div className='GameConsole-title-card'>
                    <div className='GameConsole-title-card-content'>
                        <span className='GameConsole-title-card-1'>Lights</span><span className='GameConsole-title-card-2'>Out</span>
                    </div>
                </div>
            </div>
            <div className='GameConsole-Display'>
                {this.state.isWinner ? gameStatus : currentGameBoard}
            </div>
            <button onClick={this.resetGame} className='GameConsole-reset'>RESET GAME</button>
        </div>
    )
  }
}

export default GameConsole;