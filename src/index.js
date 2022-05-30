import { WORDS } from './words';

const gameLogic = (() => {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const converted = Array.from(word);

  const player = {
    userGuess: [],
    lives: 5,
    score: 0,
  };

  function play(letters) {
    let guess = [];
    Array.from(letters.value).forEach((letter) => {
      guess.push(letter);
    });
    guess.forEach((letter) => {
      if (converted.includes(letter)) {
        while (converted.includes(letter)) {
          player.userGuess.splice(converted.indexOf(letter), 1, letter);
          converted.splice(converted.indexOf(letter), 1, '✅');
          letters.setAttribute('class', 'valid');
          player.score += 10;
          displayModule.score();
        }
      } else {
        player.lives--;
        displayModule.lives();
        letters.setAttribute('class', 'invalid');
      }
      displayModule.updateDisplay();
    });
  }

  function eventHandler(e) {
    play(e.target);
  }

  return { eventHandler, word, player };
})();

const displayModule = (() => {
  const createDisplay = (() => {
    const display = document.querySelector('.keyboard');
    const alphabetArray = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabetArray.forEach((letter) => {
      const key = document.createElement('button');
      key.setAttribute('value', letter);
      key.textContent = letter;
      display.append(key);
      key.addEventListener('click', gameLogic.eventHandler, { once: true });
    });
  })();

  const wordRandomizer = (() => {
    for (let i = 0; i < gameLogic.word.length; i++) {
      const choice = ['*', gameLogic.word[i]];
      let final = choice[Math.floor(Math.random() * choice.length)];
      gameLogic.player.userGuess.push(final);
      const display = document.querySelector('.display');
      display.textContent = gameLogic.player.userGuess.join('');
    }
  })();

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

  return { score, lives, updateDisplay };
})();
