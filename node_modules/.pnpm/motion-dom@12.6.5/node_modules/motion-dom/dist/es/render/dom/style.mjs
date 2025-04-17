const isCSSVar = (name) => name.startsWith("--");
const style = {
    set: (element, name, value) => {
        isCSSVar(name)
            ? element.style.setProperty(name, value)
            : (element.style[name] = value);
    },
    get: (element, name) => {
        return isCSSVar(name)
            ? element.style.getPropertyValue(name)
            : element.style[name];
    },
};

export { style };
