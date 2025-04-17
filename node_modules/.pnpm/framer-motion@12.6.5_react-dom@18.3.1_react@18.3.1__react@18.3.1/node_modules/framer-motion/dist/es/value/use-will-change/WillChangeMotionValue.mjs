import { MotionValue } from 'motion-dom';
import { addUniqueItem } from 'motion-utils';
import { getWillChangeName } from './get-will-change-name.mjs';

class WillChangeMotionValue extends MotionValue {
    constructor() {
        super(...arguments);
        this.values = [];
    }
    add(name) {
        const styleName = getWillChangeName(name);
        if (styleName) {
            addUniqueItem(this.values, styleName);
            this.update();
        }
    }
    update() {
        this.set(this.values.length ? this.values.join(", ") : "auto");
    }
}

export { WillChangeMotionValue };
