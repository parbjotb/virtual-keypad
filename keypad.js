const Keypad = {

	elements: {

		main: null,

		keysContainer: null,

		keys: []
	},

	eventHandlers: {

		oninput: null,

		onclose: null
	},

	properties: {

		value: "",

	},

	init() {

		this.elements.main = document.createElement("div");

		this.elements.keysContainer = document.createElement("div");

		this.elements.main.classList.add("keypad", "keypad--hidden");

		this.elements.keysContainer.classList.add("keypad_keys");
		this.elements.keysContainer.appendChild(this._createKeys());

		this.elements.keys = this.elements.keysContainer.querySelectorAll(".keypad_key");

		this.elements.main.appendChild(this.elements.keysContainer);
		document.body.appendChild(this.elements.main);

		document.querySelectorAll(".use-keypad-input").forEach(element => {
			element.addEventListener("focus", () => {
				this.open(element.value, currentValue => {
					element.value = currentValue;
				});
			});
		});
	},

	_createKeys() {

		const fragment = document.createDocumentFragment();

		const keyLayout = [
		"1", "2", "3",
		 "4", "5", "6",
		  "7", "8", "9",
		   "*", "0", "#",
		    "done", "backspace"
		];

		const createIconHTML = (icon_name) => {
			return `<i class="material-icons">${icon_name}</i>`;
		};

		keyLayout.forEach(key => {
			const keyElement = document.createElement("button");

			const insertLineBreak = ["3", "6", "9", "#"].indexOf(key) !== -1;

			keyElement.setAttribute("type", "button");
			keyElement.classList.add("keypad_key");

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

			fragment.appendChild(keyElement);

			if (insertLineBreak) {
				fragment.appendChild(document.createElement("br"));
			}
		});

		return fragment;
	},

	_triggerEvent(handlerName) {

		if (typeof this.eventHandlers[handlerName] == "function") {
			this.eventHandlers[handlerName](this.properties.value);
		}
	},

	open(initialValue, oninput, onclose) {

		this.properties.value = initialValue || "";
		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;

		this.elements.main.classList.remove("keypad--hidden");
	},

	close() {
		this.properties.value = "";
		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;
		this.elements.main.classList.add("keypad--hidden");
	}
};

window.addEventListener("DOMContentLoaded", function () {
	Keypad.init();
});