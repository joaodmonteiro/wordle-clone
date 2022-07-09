import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import { useEffect, useState } from "react";

const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";

export default function Home({ solution, emptyCells }) {
  const [numberOfTries, setNumberOfTries] = useState(0);
  const [guesses, setGuesses] = useState(["WORLD", "FIRES"]);
  const [cells, setCells] = useState([...emptyCells]);
  const [currentWord, setCurrentWord] = useState("");

  const handleKeyDown = (event) => {
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      if (currentWord.length < 5) {
        const newWord = currentWord + event.key;
        newWord = newWord.toUpperCase();
        setCurrentWord(newWord);
        updateCells(newWord);
      }
    } else if (event.key === "Backspace") {
      if (currentWord.length > 0) {
        const newWord = currentWord.slice(0, -1);
        newWord = newWord.toUpperCase();
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
    const wordArray = word.split("");

    if (guesses.length > 0) {
      guesses.forEach((guess) => {
        newCells = newCells.concat(guess.split(""));
      });
      newCells = newCells.concat(wordArray);
      newCells = fillRestOfArray(newCells);
      setCells(newCells);
    } else {
      newCells = newCells.concat(wordArray);
      newCells = fillRestOfArray(newCells);
      setCells(newCells);
      console.log(cells);
      console.log(newCells);
    }
  };

  const fillRestOfArray = (array) => {
    const cellsNeeded = 30 - array.length;
    const newArray = new Array(cellsNeeded).fill("");

    return array.concat(newArray);
  };

  const submitGuess = (guess) => {
    console.log(guess);
    console.log(solution);

    if (guess === solution) {
      alert("you won!");
    }
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
        newCells = newCells.concat(guess.split(""));
      });

      newCells = fillRestOfArray(newCells);
      setCells(newCells);
    }
  }, []);

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
        {cells.map((cell) => (
          <div className={styles.cell}>{cell}</div>
        ))}
      </div>

      <p>Solution: {solution}</p>
      <p>Current word: {currentWord}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const resp = await fetch(API_URL, { mode: "no-cors" });
  const words = await resp.json();
  const solution = words[Math.floor(Math.random() * words.length)];

  const emptyCells = [];
  emptyCells.length = 30;
  emptyCells.fill("");

  return {
    props: { solution, emptyCells }, // will be passed to the page component as props
  };
}
