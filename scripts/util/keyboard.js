export class KeyboardManager {
    #keysPressed = new Map();

    constructor() {
        window.addEventListener("keydown", (e) => {
            this.#keysPressed.set(e.key, true);
        });

        window.addEventListener("keyup", (e) => {
            this.#keysPressed.set(e.key, false);
        });
    }

    isKeyPressed(key) {
        return this.#keysPressed.get(key) ?? false;
    }
}
