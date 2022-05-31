import { WORDS } from './words';

const gameLogic = (() => {
  let word = WORDS[Math.floor(Math.random() * WORDS.length)];
  let converted = Array.from(word);

  const player = {
    userGuess: [],
    lives: 10,
    score: 0,
  };

  function play(letters) {
    let guess = [];
    Array.from(letters.getAttribute('data-key')).forEach((letter) => {
      guess.push(letter);
    });
    console.log(guess);
    guess.forEach((letter) => {
      if (converted.includes(letter)) {
        //while statement to get 2 or more letters in the word at once
        while (converted.includes(letter)) {
          player.userGuess.splice(converted.indexOf(letter), 1, letter);
          converted.splice(converted.indexOf(letter), 1, '✅');
          letters.setAttribute('class', 'valid');
          player.score += 10;
          displayModule.score();
          console.log(player.userGuess);
        }
      } else {
        player.lives--;
        displayModule.lives();
        letters.setAttribute('class', 'invalid');
        console.log(player.userGuess);
      }

      displayModule.updateDisplay();
    });
  }

  function eventHandler(e) {
    play(e.target);
  }

  const resetLogic = () => {
    word = WORDS[Math.floor(Math.random() * WORDS.length)];
    converted = Array.from(word);
    gameLogic.player.userGuess = [];
    displayModule.wordRandomizer(word);
  };

  function checkword(e) {
    eventHandler(e);
    if (player.userGuess.join('') === word) {
      resetLogic();
      displayModule.reset();
    }
  }

  function checkLives(e) {
    if (player.lives > 0) {
      checkword(e);
    } else {
      console.log('you lose');
    }
  }

  return { checkLives, word, player };
})();

const displayModule = (() => {
  const createDisplay = () => {
    const display = document.querySelector('.keyboard');
    const alphabetArray = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabetArray.forEach((letter) => {
      const key = document.createElement('button');
      key.setAttribute('data-key', letter);
      key.textContent = letter;
      display.append(key);
      key.addEventListener('click', gameLogic.checkLives, { once: true });
    });
  };
  createDisplay();

  function score() {
    const domscore = document.querySelector('.score');
    domscore.textContent = `lives: ${gameLogic.player.score}`;
  }

  function lives() {
    const domlives = document.querySelector('.lives');
    domlives.textContent = `lives: ${gameLogic.player.lives}`;
  }

  function updateDisplay() {
    const display = document.querySelector('.display');
    display.textContent = gameLogic.player.userGuess.join('');
  }

  function reset() {
    console.log('rest');
    const keys = document.querySelectorAll('[data-key]');
    keys.forEach((key) => {
      key.remove();
      key.removeEventListener('click', gameLogic.checkword, { once: true });
    });
    const display = document.querySelector('.display');
    display.textContent = '';

    createDisplay();
    displayModule.updateDisplay();
  }

  const wordRandomizer = (word) => {
    console.log(word);
    for (let i = 0; i < word.length; i++) {
      const choice = ['*', word[i]];
      let final = choice[Math.floor(Math.random() * choice.length)];
      gameLogic.player.userGuess.push(final);
      const display = document.querySelector('.display');
      display.textContent = gameLogic.player.userGuess.join('');
    }
  };
  wordRandomizer(gameLogic.word);
  return { score, lives, updateDisplay, createDisplay, wordRandomizer, reset };
})();
