 // first define an object
// this object will be the entire keypad
// contain all methods and properties inside this object

const Keypad = {
    // this needs to keep track of main keypad
    // needs to keep track of keys
    // needs to keep track of buttons
	elements: {
        // main refers to main keyboard element
		main: null,
        // keysContainer refers to the keys container
		keysContainer: null,
        // keys is an array for the key buttons
		keys: []
	},

	eventHandlers: {
        // when the other code says open keyboard
        // they're gonna hit the eventHandlers
        //oninput is what is triggered when we hit any key except done
		oninput: null,
        // onClose is triggered when we hit the done button
		onclose: null
	},

	properties: {
        // contains values for current state of keyboard
        // value represents current value of keyboard
		value: "",

	},

	init() {
        // init runs when the page first loads
        // it runs all the elements
        // create main element div
		this.elements.main = document.createElement("div");

        // create keysContainer div
		this.elements.keysContainer = document.createElement("div");

        // Setup main elements, this creates classes and adds the keys
		this.elements.main.classList.add("keypad", "keypad--hidden");

        // this creates the keypad_keys class
		this.elements.keysContainer.classList.add("keypad_keys");
		this.elements.keysContainer.appendChild(this._createKeys());

        // this makes everything in the keysContainer get stored in a keys array
        // querySelectorAll takes everything from keyboard_key and puts it into keys array
		this.elements.keys = this.elements.keysContainer.querySelectorAll(".keypad_key");

        // Add to DOM
        // this will append the keys container to main
        // this will append main to the html body
		this.elements.main.appendChild(this.elements.keysContainer);
		document.body.appendChild(this.elements.main);

        //Brings up the keyboard for elements with "use-keypad-input" class
        // the text area has this class
        //for each input that has that input class, when we focus on that input it will open up the keyboard
        // open() has a few parameters, but if we don't give it a value, it reverts to an empty string
        // the value of the text area will be set to the currentValue of the keyboard
		document.querySelectorAll(".use-keypad-input").forEach(element => {
			element.addEventListener("focus", () => {
				this.open(element.value, currentValue => {
					element.value = currentValue;
				});
			});
		});
	},

	_createKeys() {

        // this method creates the HTML for each of the keys
        // returns document fragments, which are little virtual elements you can append to other elements
		const fragment = document.createDocumentFragment();

        // keyLayout will contain all keys and buttons and numbers
        // we will loop through the keys and create elements for each one
		const keyLayout = [
		"1", "2", "3",
		 "4", "5", "6",
		  "7", "8", "9",
		   "*", "0", "#",
		    "done", "backspace"
		];

        // a function which creates the HTML for an icon
		const createIconHTML = (icon_name) => {
			return `<i class="material-icons">${icon_name}</i>`;
		};

        // looping through keys making button elements for each one
		keyLayout.forEach(key => {
			const keyElement = document.createElement("button");
            // for the lines on the keypad between 3-6-9-0
            // saying if the key we are looping through is not in the array, then return -1 false and don't insert line break
			const insertLineBreak = ["3", "6", "9", "#"].indexOf(key) !== -1;

            // add attributes/classes
            // makes each key element a button
            // modifies those buttons according to keypad_key class css
			keyElement.setAttribute("type", "button");
			keyElement.classList.add("keypad_key");

            // we need to do dif things depending on which key we loop through
            // starting with backspace which has a wide key
            // the createIcon method is what adds the icon picture based on the name
			switch (key) {
				case "backspace":
				keyElement.classList.add("keypad_key--wide");
				keyElement.innerHTML = createIconHTML("backspace");

				keyElement.addEventListener("click", () => {
					this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
					this._triggerEvent("oninput");
				});

				break;

				case "done":
				keyElement.classList.add("keypad_key--wide", "keypad_key--dark");
				keyElement.innerHTML = createIconHTML("check_circle");

				keyElement.addEventListener("click", () => {
					this.close();
					this._triggerEvent("onclose");
				});

				break;

				default:

				keyElement.textContent = key.toLowerCase();

				keyElement.addEventListener("click", () => {
					this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
					this._triggerEvent("oninput");
				});

				break;
			}
            // adds the key to the fragment container
			fragment.appendChild(keyElement);

            // if we need to insert a linebreak, add the br element

			if (insertLineBreak) {
				fragment.appendChild(document.createElement("br"));
			}
		});

		return fragment;
	},

	_triggerEvent(handlerName) {
        // triggers one of the two events in eventHandler
        // is a function specified as the value of one of the event properties (oninput or onclose)
        // if there is a function specified, if the user has specified a function for the handler then we can fire it off
        // we are passing the current value of the keypad to the code that is using the keypad
		if (typeof this.eventHandlers[handlerName] == "function") {
			this.eventHandlers[handlerName](this.properties.value);
		}
	},

	open(initialValue, oninput, onclose) {
        // if a value was provided, use it, or pass an empty string instead
        // this resets the value of the keyboard
		this.properties.value = initialValue || "";
		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;
        // when we open the keyboard, it is no longer going to be hidden

		this.elements.main.classList.remove("keypad--hidden");
	},

	close() {
		// upon closing the keyboard it resets to an empty string
		this.properties.value = "";
		// also reset the eventHandlers
		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;
		// when we hit the done button, it will hide the keypad
		this.elements.main.classList.add("keypad--hidden");
	}
};

window.addEventListener("DOMContentLoaded", function () {
	Keypad.init();
});