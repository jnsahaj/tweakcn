function updateSVGDimensions(instance, renderState) {
    try {
        renderState.dimensions =
            typeof instance.getBBox === "function"
                ? instance.getBBox()
                : instance.getBoundingClientRect();
    }
    catch (e) {
        // Most likely trying to measure an unrendered element under Firefox
        renderState.dimensions = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
    }
}

export { updateSVGDimensions };
