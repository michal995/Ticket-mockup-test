import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Menu } from './scenes/Menu';
import { Game } from './scenes/Game';
import { Results } from './scenes/Results';
import { theme } from './ui/theme';

document.addEventListener(
  'touchmove',
  (event) => {
    const touchEvent = event as TouchEvent;
    if (touchEvent.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

document.addEventListener(
  'touchstart',
  (event) => {
    if ((event as TouchEvent).touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

document.addEventListener('gesturestart', (event) => event.preventDefault());
document.addEventListener('gesturechange', (event) => event.preventDefault());
document.addEventListener('gestureend', (event) => event.preventDefault());

document.body.style.backgroundColor = theme.colors.backgroundHex;
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.touchAction = 'manipulation';
document.body.style.height = '100%';
document.documentElement.style.height = '100%';

type SceneConstructor = new (...args: any[]) => Phaser.Scene;

const scenes: SceneConstructor[] = [Boot, Menu, Game, Results];

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: theme.colors.background,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080
  },
  scene: scenes,
  dom: {
    createContainer: true
  },
  input: {
    activePointers: 3
  }
};

export const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
  game.scale.refresh();
});
