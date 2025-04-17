(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MotionUtils = {}));
})(this, (function (exports) { 'use strict';

    function addUniqueItem(arr, item) {
        if (arr.indexOf(item) === -1)
            arr.push(item);
    }
    function removeItem(arr, item) {
        const index = arr.indexOf(item);
        if (index > -1)
            arr.splice(index, 1);
    }
    // Adapted from array-move
    function moveItem([...arr], fromIndex, toIndex) {
        const startIndex = fromIndex < 0 ? arr.length + fromIndex : fromIndex;
        if (startIndex >= 0 && startIndex < arr.length) {
            const endIndex = toIndex < 0 ? arr.length + toIndex : toIndex;
            const [item] = arr.splice(fromIndex, 1);
            arr.splice(endIndex, 0, item);
        }
        return arr;
    }

    exports.warning = () => { };
    exports.invariant = () => { };
    {
        exports.warning = (check, message) => {
            if (!check && typeof console !== "undefined") {
                console.warn(message);
            }
        };
        exports.invariant = (check, message) => {
            if (!check) {
                throw new Error(message);
            }
        };
    }

    const MotionGlobalConfig = {
        skipAnimations: false,
        useManualTiming: false,
    };

    /*#__NO_SIDE_EFFECTS__*/
    function memo(callback) {
        let result;
        return () => {
            if (result === undefined)
                result = callback();
            return result;
        };
    }

    /*#__NO_SIDE_EFFECTS__*/
    const noop = (any) => any;

    /*
      Progress within given range

      Given a lower limit and an upper limit, we return the progress
      (expressed as a number 0-1) represented by the given value, and
      limit that progress to within 0-1.

      @param [number]: Lower limit
      @param [number]: Upper limit
      @param [number]: Value to find progress within given range
      @return [number]: Progress of value within range as expressed 0-1
    */
    /*#__NO_SIDE_EFFECTS__*/
    const progress = (from, to, value) => {
        const toFromDifference = to - from;
        return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
    };

    class SubscriptionManager {
        constructor() {
            this.subscriptions = [];
        }
        add(handler) {
            addUniqueItem(this.subscriptions, handler);
            return () => removeItem(this.subscriptions, handler);
        }
        notify(a, b, c) {
            const numSubscriptions = this.subscriptions.length;
            if (!numSubscriptions)
                return;
            if (numSubscriptions === 1) {
                /**
                 * If there's only a single handler we can just call it without invoking a loop.
                 */
                this.subscriptions[0](a, b, c);
            }
            else {
                for (let i = 0; i < numSubscriptions; i++) {
                    /**
                     * Check whether the handler exists before firing as it's possible
                     * the subscriptions were modified during this loop running.
                     */
                    const handler = this.subscriptions[i];
                    handler && handler(a, b, c);
                }
            }
        }
        getSize() {
            return this.subscriptions.length;
        }
        clear() {
            this.subscriptions.length = 0;
        }
    }

    /**
     * Converts seconds to milliseconds
     *
     * @param seconds - Time in seconds.
     * @return milliseconds - Converted time in milliseconds.
     */
    /*#__NO_SIDE_EFFECTS__*/
    const secondsToMilliseconds = (seconds) => seconds * 1000;
    /*#__NO_SIDE_EFFECTS__*/
    const millisecondsToSeconds = (milliseconds) => milliseconds / 1000;

    /*
      Convert velocity into velocity per second

      @param [number]: Unit per frame
      @param [number]: Frame duration in ms
    */
    function velocityPerSecond(velocity, frameDuration) {
        return frameDuration ? velocity * (1000 / frameDuration) : 0;
    }

    const warned = new Set();
    function hasWarned(message) {
        return warned.has(message);
    }
    function warnOnce(condition, message, element) {
        if (condition || warned.has(message))
            return;
        console.warn(message);
        if (element)
            console.warn(element);
        warned.add(message);
    }

    exports.MotionGlobalConfig = MotionGlobalConfig;
    exports.SubscriptionManager = SubscriptionManager;
    exports.addUniqueItem = addUniqueItem;
    exports.hasWarned = hasWarned;
    exports.memo = memo;
    exports.millisecondsToSeconds = millisecondsToSeconds;
    exports.moveItem = moveItem;
    exports.noop = noop;
    exports.progress = progress;
    exports.removeItem = removeItem;
    exports.secondsToMilliseconds = secondsToMilliseconds;
    exports.velocityPerSecond = velocityPerSecond;
    exports.warnOnce = warnOnce;

}));
