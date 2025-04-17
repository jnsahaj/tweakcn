export type RawEventNames = {
	readonly requestFullscreen: string;
	readonly exitFullscreen: string;
	readonly fullscreenElement: string;
	readonly fullscreenEnabled: string;
	readonly fullscreenchange: string;
	readonly fullscreenerror: string;
};

export type EventName = 'change' | 'error';

/**
Simple wrapper for cross-browser usage of the JavaScript [Fullscreen API](https://developer.mozilla.org/en/DOM/Using_full-screen_mode), which lets you bring the page or any element into fullscreen. Smoothens out the browser implementation differences, so you don't have to.
*/
declare const screenfull: {
	/**
	Whether fullscreen is active.
	*/
	readonly isFullscreen: boolean;

	/**
	The element currently in fullscreen, otherwise `undefined`.
	*/
	readonly element: Element | undefined;

	/**
	Whether you are allowed to enter fullscreen. If your page is inside an `<iframe>` you will need to add a `allowfullscreen` attribute (+ `webkitallowfullscreen` and `mozallowfullscreen`).

	@example
	```
	import screenfull from 'screenfull';

	if (screenfull.isEnabled) {
		screenfull.request();
	}
	```
	*/
	readonly isEnabled: boolean;

	/**
	Exposes the raw properties (prefixed if needed) used internally.
	*/
	raw: RawEventNames;

	/**
	Make an element fullscreen.

	If your page is inside an `<iframe>` you will need to add a `allowfullscreen` attribute (+ `webkitallowfullscreen` and `mozallowfullscreen`).

	Keep in mind that the browser will only enter fullscreen when initiated by user events like click, touch, key.

	@param element - Default is `<html>`. If called with another element than the currently active, it will switch to that if it's a descendant.
	@param options - [`FullscreenOptions`](https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions).
	@returns A promise that resolves after the element enters fullscreen.

	@example
	```
	import screenfull from 'screenfull';

	// Fullscreen the page
	document.getElementById('button').addEventListener('click', () => {
		if (screenfull.isEnabled) {
			screenfull.request();
		} else {
			// Ignore or do something else
		}
	});

	// Fullscreen an element
	const element = document.getElementById('target');

	document.getElementById('button').addEventListener('click', () => {
		if (screenfull.isEnabled) {
			screenfull.request(element);
		}
	});

	// Fullscreen an element with options
	const element = document.getElementById('target');

	document.getElementById('button').addEventListener('click', () => {
		if (screenfull.isEnabled) {
			screenfull.request(element, {navigationUI: 'hide'});
		}
	});

	// Fullscreen an element with jQuery
	const element = $('#target')[0]; // Get DOM element from jQuery collection

	$('#button').on('click', () => {
		if (screenfull.isEnabled) {
			screenfull.request(element);
		}
	});
	```
	*/
	request(element?: Element, options?: FullscreenOptions): Promise<void>;

	/**
	Brings you out of fullscreen.

	@returns A promise that resolves after the element exits fullscreen.
	*/
	exit(): Promise<void>;

	/**
	Requests fullscreen if not active, otherwise exits.

	@param element - The default is `<html>`. If called with another element than the currently active, it will switch to that if it's a descendant.
	@param options - [`FullscreenOptions`](https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions).
	@returns A promise that resolves after the element enters/exits fullscreen.

	@example
	```
	import screenfull from 'screenfull';

	// Toggle fullscreen on a image with jQuery

	$('img').on('click', event => {
		if (screenfull.isEnabled) {
			screenfull.toggle(event.target);
		}
	});
	```
	*/
	toggle(element?: Element, options?: FullscreenOptions): Promise<void>;

	/**
	Add a listener for when the browser switches in and out of fullscreen or when there is an error.

	@example
	```
	import screenfull from 'screenfull';

	// Detect fullscreen change
	if (screenfull.isEnabled) {
		screenfull.on('change', () => {
			console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
		});
	}

	// Detect fullscreen error
	if (screenfull.isEnabled) {
		screenfull.on('error', event => {
			console.error('Failed to enable fullscreen', event);
		});
	}
	```
	*/
	on(name: EventName, handler: (event: Event) => void): void;

	/**
	Remove a previously registered event listener.

	@example
	```
	import screenfull from 'screenfull';

	screenfull.off('change', callback);
	```
	*/
	off(name: EventName, handler: (event: Event) => void): void;

	/**
	Alias for `.on('change', function)`.
	*/
	onchange(handler: (event: Event) => void): void;

	/**
	Alias for `.on('error', function)`.
	*/
	onerror(handler: (event: Event) => void): void;
};

export default screenfull;
