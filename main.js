import Game from './src/modules/Game';

document.addEventListener('DOMContentLoaded', function() {

  let game = new Game({
    spritesheet: 'dist/sprites.json'
  }).load();

}, false);
