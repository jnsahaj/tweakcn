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

export { hasWarned, warnOnce };
