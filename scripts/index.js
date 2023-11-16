import { useStyle } from "./util/css.js";
import { KeyboardManager } from "./util/keyboard.js";

const kbm = new KeyboardManager();

useStyle('body', {
    margin: "0",
    width: '100%',
    minHeight: "100vh",
    overflow: "hidden"
});

const player = {
    size: 40,
    x: 0,
    y: 0,
}

player.style = useStyle('player', {
    width: (_, state) => `${state.size}px`,
    height: (style, state) => style.width(style, state),
    marginLeft: (_, state) => `${state.x}px`,
    marginTop: (_, state) => `${state.y}px`,
    background: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
}, player);

async function loop() {
    if (kbm.isKeyPressed('ArrowLeft')) {
        player.x -= 10;
        await player.style.refresh();
    }

    if (kbm.isKeyPressed('ArrowRight')) {
        player.x += 10;
        await player.style.refresh();
    }

    if (kbm.isKeyPressed('ArrowUp')) {
        player.y -= 10;
        await player.style.refresh();
    }

    if (kbm.isKeyPressed('ArrowDown')) {
        player.y += 10;
        await player.style.refresh();
    }
    
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);