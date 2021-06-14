const keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    properties: {
        value: '',
        capsLock: false,
        shift: false,
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement('div');
        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        document.body.append(this.elements.main);

        this.elements.keysContainer = document.createElement('div');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.main.append(this.elements.keysContainer);
        this.elements.keysContainer.append(this._createKeys());  // Add keys

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');  // Get all keys

        // Toggle virtual keyboard
        document.querySelectorAll('.use-keyboard').forEach(item => {
            item.addEventListener('focus', () => {
                this.open(item.value, currentValue => {
                    item.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
            "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
            "done", "space",
        ];

        // Create HTML for an icon
        const createIconHTML = (iconName) => {
            return `<i class="material-icons">${iconName}</i>`
        };

        // Create keys
        keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', ']', 'enter', '/'].indexOf(key) !== -1;

            // Add attributes
            keyElement.classList.add('keyboard__key');
            keyElement.setAttribute('type', 'button');

            switch (key) {
                case 'backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHTML('backspace');
                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });
                    break;

                case 'shift':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activate', 'shift');
                    keyElement.innerHTML = createIconHTML('upload');
                    keyElement.addEventListener('click', () => {
                        this._toggleShift();
                        keyElement.classList.toggle('keyboard__key--active', this.properties.shift);
                    });
                    break;

                case 'caps':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activate', 'caps');
                    keyElement.innerHTML = createIconHTML('keyboard_capslock');
                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                    });
                    break;

                case 'enter':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHTML('keyboard_return');
                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');
                    });
                    break;

                case 'space':
                    keyElement.classList.add('keyboard__key--extra-wide');
                    keyElement.innerHTML = createIconHTML('space_bar');
                    keyElement.addEventListener('click', () => {
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');
                    });
                    break;


                case 'done':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
                    keyElement.innerHTML = createIconHTML('check_circle');
                    keyElement.addEventListener('click', () => {
                        this.close();
                        this._triggerEvent('onclose');
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener('click', () => {
                        this.properties.value += (this.properties.capsLock || this.properties.shift) ? key.toUpperCase() && keyElement.textContent : key.toLowerCase() && keyElement.textContent;
                        this._triggerEvent('oninput');
                    });
                    break;
            }

            fragment.append(keyElement);

            if (insertLineBreak) {
                fragment.append(document.createElement('br'));
            }
        });
        return fragment;
    },

    _triggerEvent(handler) {
        if (typeof this.eventHandlers[handler] == 'function') {
            this.eventHandlers[handler](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        //  Shift-Key is blocking  when CapsLock-Key is true
        if (this.properties.capsLock) {
            document.querySelector('.shift').disabled = true;
        } else {
            document.querySelector('.shift').disabled = false;
        }

        for (const key of this.elements.keys) {
            //  Check keys and set parameter UpperCase/LowerCase (for CapsLock)
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleShift() {
        this.properties.shift = !this.properties.shift;

        //  CapsLock-Key is blocking when Shift-Key is true
        if (this.properties.shift) {
            document.querySelector('.caps').disabled = true;
        } else {
            document.querySelector('.caps').disabled = false;
        }

        const specialValues = {
            "/": '?',
            "?": '/',
            '-': '_',
            '_': '-',
            '=': '+',
            '+': '=',
            '[': '{',
            '{': '[',
            ']': '}',
            '}': ']',
            ';': ':',
            ':': ';',
            "'": '"',
            '"': "'",
            ',': '<',
            '<': ',',
            '.': '>',
            '>': '.',
            '1': '!',
            '!': '1',
            '2': '@',
            '@': '2',
            '3': '#',
            '#': '3',
            '4': '$',
            '$': '4',
            '5': '%',
            '%': '5',
            '6': '^',
            '^': '6',
            '7': '&',
            '&': '7',
            '8': '*',
            '*': '8',
            '9': '(',
            '(': '9',
            '0': ')',
            ')': '0',
        };

        for (const key of this.elements.keys) {

            if (key.childElementCount === 0) {
                let property = key.textContent;

                if (property in specialValues) {
                    key.textContent = specialValues[property];
                } else {
                    key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
                }
            }
        }
    },

    open(initalValue, oninput, onclose) {
        this.properties.value = initalValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;

        this.elements.main.classList.remove('keyboard--hidden');
    },

    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.oninput = oninput;

        this.elements.main.classList.add('keyboard--hidden');
    }
};

window.addEventListener('DOMContentLoaded', () => {
    keyboard.init();
});