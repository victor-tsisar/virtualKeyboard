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
            "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "done", "space",
        ];

        // Create HTML for an icon
        const createIconHTML = (iconName) => {
            return `<i class="material-icons">${iconName}</i>`
        };

        // Create keys
        keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', ']', 'enter', '?'].indexOf(key) !== -1;

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

                case 'caps':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activate');
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
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
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

        for (const key of this.elements.keys) {
            //  Check keys and set parameter UpperCase/LowerCase (for CapsLock)
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
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