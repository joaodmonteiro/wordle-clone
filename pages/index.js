import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import { useEffect, useState } from "react";

const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";

export default function Home({ solution, emptyCells }) {
  const [numberOfTries, setNumberOfTries] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [cells, setCells] = useState([...emptyCells]);
  const [currentWord, setCurrentWord] = useState([]);

  const handleKeyDown = (event) => {
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      if (currentWord.length < 5) {
        const newWord = [
          ...currentWord,
          { letter: event.key.toUpperCase(), color: null },
        ];
        setCurrentWord(newWord);
        updateCells(newWord);
      }
    } else if (event.key === "Backspace") {
      if (currentWord.length > 0) {
        const newWord = currentWord.slice(0, -1);
        setCurrentWord(newWord);
        updateCells(newWord);
      }
    } else if (event.key === "Enter") {
      if (currentWord.length === 5) {
        submitGuess(currentWord);
      }
    }
  };

  const updateCells = (word) => {
    let newCells = [];

    if (guesses.length > 0) {
      guesses.forEach((guess) => {
        guess.forEach((char) => {
          newCells.push({ letter: char.letter, color: char.color });
        });
      });
      newCells = [...newCells, ...word];
      newCells = fillRestOfArray(newCells);
      setCells(newCells);
    } else {
      newCells = [...newCells, ...word];
      newCells = fillRestOfArray(newCells);
      setCells(newCells);
    }

    console.log(cells);

    console.log("current word: ");
    console.log(currentWord);
  };

  const fillRestOfArray = (array) => {
    const cellsNeeded = 30 - array.length;
    const newArray = new Array(cellsNeeded).fill({ letter: null, color: null });

    return array.concat(newArray);
  };

  const submitGuess = (guess) => {
    let newGuess = [];
    for (let i = 0; i < guess.length; i++) {
      for (let j = 0; j < solution.split("").length; j++) {
        if (guess[i].letter === solution.split("")[j]) {
          if (i === j) {
            newGuess.push({
              letter: guess[i].letter,
              color: "green",
            });
            break;
          } else {
            newGuess.push({
              letter: guess[i].letter,
              color: "yellow",
            });
            break;
          }
        } else {
          if (j === solution.split("").length - 1) {
            newGuess.push({
              letter: guess[i].letter,
              color: "grey",
            });
          }
        }
      }
    }

    setGuesses([...guesses, newGuess]);
    updateCells(newGuess);
    setCurrentWord([]);
    console.log(newGuess);
    // Check if word is correct
    // if it is, end game
    //if its not
    // check the right letters
    //insert word in guesses array
  };

  useEffect(() => {
    let newCells = [];

    if (guesses.length > 0) {
      guesses.forEach((guess) => {
        guess.forEach((char) => {
          newCells.push({ letter: char.letter, color: char.color });
        });
      });

      newCells = fillRestOfArray(newCells);
      setCells(newCells);
    }
  }, []);

  let grey = {
    backgroundColor: "grey",
  };

  let green = {
    backgroundColor: "green",
  };

  let yellow = {
    backgroundColor: "yellow",
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Wordle clone</title>
        <meta
          name="description"
          content="Wordle clone made by João Monteiro."
        />
      </Head>

      <h1>WORDLE CLONE</h1>

      <div
        className={styles.board_container}
        tabIndex={0}
        onKeyDown={handleKeyDown}>
        {cells.map((cell, index) => (
          <div
            key={index}
            className={styles.cell}
            style={{ backgroundColor: cell.color }}>
            {cell.letter}
          </div>
        ))}
      </div>

      <p>Solution: {solution}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const resp = await fetch(API_URL, { mode: "no-cors" });
  const words = await resp.json();
  const solution = words[Math.floor(Math.random() * words.length)];

  const emptyCells = [];
  emptyCells.length = 30;
  emptyCells.fill({
    letter: null,
    color: null,
  });

  console.log(emptyCells);

  return {
    props: { solution, emptyCells }, // will be passed to the page component as props
  };
}
