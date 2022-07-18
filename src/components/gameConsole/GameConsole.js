import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';
import React, { Component } from 'react';
import GameSquare from '../gameSquare/GameSquare';
import './GameConsole.css';

class GameConsole extends Component {
    static defaultProps = {
        boardDimension: 5,
        isActiveProbability: .25
    };

    constructor(props){
        super(props);

        let boardDetails = this.generateBoard();

        this.state = {
            gameBoardRegistry: boardDetails[0],
            gameBoardDetails: boardDetails[1],
            isWinner: false,
            isLoser: false,
            isGameOver: false,
            isCurrentSqr: false,
            currSquare: '',
            currAdjSquares: []
        }

        this.generateBoard = this.generateBoard.bind(this);
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
                // let isActive = sqrStatusValues[Math.floor(Math.random()*sqrStatusValues.length)];
                let isActive;
                let randomFactor = Math.random();
                if (randomFactor > this.props.isActiveProbability) {
                    isActive = true;
                } else {
                    isActive = false;
                }
                board[sqrId] = {'sqrId': sqrId, 'keyValue': keyValue, 'row': row, 'column': col, 'isActive': isActive};
            }
        }

        let registry = Object.keys(board);

        console.log(`generateBoard registry: ${registry}`);
        console.log(`generateBoard board: ${JSON.stringify(board)}`);

        // this.setState(currState => {
        //     let newState = {...currState};

        //     newState.gameBoardRegistry = registry;
        //     newState.gameBoardStatus = board;

        //     return newState;
        // });

        // console.log(`generateBoard board: ${JSON.stringify(board)}`);

        return [registry, board];

    }

    generateGameSquares(){
        let gameSquares = this.props.gameSquaresKeys.map(sqrId => (
            <GameSquare key={sqrId} id={sqrId} isActive={(sqrId === this.state.currSquare || this.state.currAdjSquares.includes(sqrId)) ? true : false} gameFunction={this.registerGameMove}/>
        ));

        return gameSquares;

    }

    generateGameBoardElements(){

        let registry = this.state.gameBoardRegistry;
        let gBoard = this.state.gameBoardDetails
        let sqrDimension = (100/this.props.boardDimension) - 3;
        // console.log(`boardDimension | sqrDimension => ${this.state.boardDimension} | ${sqrDimension}`);
        // console.log(`generateGameBoardElements registry: ${registry}`);
        // console.log(`generateGameBoardElements gBoard: ${JSON.stringify(gBoard)}`);
        let gameSquares = registry.map(sqr => (
            <GameSquare
                key={gBoard[sqr].keyValue}
                id={gBoard[sqr].sqrId}
                isActive={(gBoard[sqr].sqrId === this.state.currSquare || gBoard[sqr].isActive) ? true : false}
                styleDim={sqrDimension}
                gameFunction={this.registerGameMove}
            />
        ));

        return gameSquares;
    }

    // adjacentSquareCheck(sqrId, arr){
    //     if(this.props.gameSquaresKeys.includes(sqrId)){
    //         arr.push(sqrId);
    //         console.log(`potential adjacents: ${arr}`)
    //     }
    // }

    generateAdjacentSquares(potentialSqrsArr){

        let adjacentSqrs = [];

        potentialSqrsArr.forEach((sqrId) => {
            if(this.state.gameBoardRegistry.includes(sqrId)){
                adjacentSqrs.push(sqrId);
                // console.log(`adjacentSqrs: ${adjacentSqrs}`);
            }
        });

        return adjacentSqrs;
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

    registerGameMove(sqrId){
        
        // console.log(`you clicked: ${sqrId}`);

        this.setState(currState => {
            let newState = {...currState};
            newState.currSquare = sqrId;
            newState.currAdjSquares = this.determineAdjacents(sqrId);

            // let sqrIdElements = sqrId.split('');
            // let row = Number(sqrIdElements[1]);
            // let rowPlus = row + 1;
            // let rowMinus = row - 1;
            // console.log(`row: ${row} | rowPlus: ${rowPlus} | rowMinus: ${rowMinus}`);
            // let column = Number(sqrIdElements[3]);
            // let columnPlus = column + 1;
            // let columnMinus = column - 1;
            // console.log(`column: ${column} | columnPlus: ${columnPlus} | columnMinus: ${columnMinus}`);
            // let potentialAdjs = [];
            // let leftAdj = `r${row}c${columnMinus}`;
            // console.log(`leftAdj: ${leftAdj}`);
            // this.adjacentSquareCheck(leftAdj, potentialAdjs);
            // let rightAdj = `r${row}c${columnPlus}`;
            // console.log(`rightAdj: ${rightAdj}`);
            // this.adjacentSquareCheck(rightAdj, potentialAdjs);
            // let topAdj = `r${rowMinus}c${column}`;
            // console.log(`topAdj: ${topAdj}`);
            // this.adjacentSquareCheck(topAdj, potentialAdjs);
            // let bottomAdj = `r${rowPlus}c${column}`;
            // console.log(`bottomAdj: ${bottomAdj}`);
            // this.adjacentSquareCheck(bottomAdj, potentialAdjs);
            // newState.currAdjSquares = potentialAdjs;

            return newState
        });
    }

    resetGame(){
        this.setState(currState => {
            let newState = {...currState};

            let resetGameBoard = this.generateBoard();

            newState.gameBoardRegistry = resetGameBoard[0];
            newState.gameBoardDetails = resetGameBoard[1];

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

        // let currentGameSquares = this.generateGameSquares();

        let currentGameBoard = this.generateGameBoardElements();

        console.log(`registry: ${this.state.gameBoardRegistry}`);
        console.log(`board details: ${JSON.stringify(this.state.gameBoardDetails)}`);

        // let gameBoardRegistry = this.generateBoard(this.state.boardDimension);
        // console.log(`game board registry: ${gameBoardRegistry}`);

        // let currentGameBoard = this.generateGameBoardElements();

    return (
        <div className='GameConsole'>
            <div className='GameConsole-title'>
                {/* <div className='GameConsole-title-card GameConsole-title-card-1'>Lights</div>
                <div className='GameConsole-title-card GameConsole-title-card-2'>Out</div> */}
                <div className='GameConsole-title-card'>
                    <div className='GameConsole-title-card-content'>
                        <span className='GameConsole-title-card-1'>Lights</span><span className='GameConsole-title-card-2'>Out</span>
                    </div>
                </div>
            </div>
            <div className='GameConsole-Display'>
                {/* {currentGameSquares} */}
                {currentGameBoard}
            </div>
            <button onClick={this.resetGame} className='GameConsole-reset'>RESET GAME</button>
        </div>
    )
  }
}

export default GameConsole;