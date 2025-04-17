let warning = () => { };
let invariant = () => { };
if (process.env.NODE_ENV !== "production") {
    warning = (check, message) => {
        if (!check && typeof console !== "undefined") {
            console.warn(message);
        }
    };
    invariant = (check, message) => {
        if (!check) {
            throw new Error(message);
        }
    };
}

export { invariant, warning };
