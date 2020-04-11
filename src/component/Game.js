import React, { useState, useEffect } from "react";
import StarsDisplay from './StarsDisplay';
import PlayNumber from './PlayNumber';
import PlayAgain from './PlayAgain';

import utils from '../math-util'

const useGameState = () =>{
 const [stars, setStars] = useState(utils.random(1,9));
 const [availableNums, setAvailableNums] = useState(utils.range(1,9));
 const [candidateNums, setCandidateNums] = useState([]);
 const [secondsLeft, setSecondsLeft] = useState(10);

 useEffect(() => {
  if (secondsLeft > 0 && availableNums.length > 0) {
    const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }
});

const setGameState = (newCandidateNums) =>{
    if (utils.sum(newCandidateNums) !== stars) {
        setCandidateNums(newCandidateNums);
      } else {
        const newAvailableNums = availableNums.filter(
          n => !newCandidateNums.includes(n)
        );
        setStars(utils.randomSumIn(newAvailableNums, 9));
        setAvailableNums(newAvailableNums);
        setCandidateNums([]);
      }
    };
return { stars, availableNums, candidateNums, secondsLeft, setGameState };
};

const Game = (props) =>{

  const {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState();

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus =
    availableNums.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "active";

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return "used";
    }

    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? "wrong" : "candidate";
    }

    return "available";
  };

  const onNumberClick = (number, currentStatus) => {
    if (currentStatus === "used" || secondsLeft === 0) {
      return;
    }

    const newCandidateNums =
      currentStatus === "available"
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);

    setGameState(newCandidateNums);
  };

    return (

        <div className="game">  
        <div className="help">
          
        <h3>Pick 1 or more numbers that sum to the number of stars.</h3>
        </div>

        <div className ="left">
        {gameStatus !== "active" ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
            <StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
        {utils.range(1, 9).map(number => (
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          ))}
        </div>
        <div className="timer">Time Remaining: {secondsLeft}</div>
        <div className="footer">Made with <svg className="heart" viewBox="0 0 32 29.6">
  <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
    c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
</svg>  by Manoj Verma <span> Happy Learning!!!</span></div>
  </div>
       
    );
}

export default Game;