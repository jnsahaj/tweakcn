'use strict';

var React = require('react');
var shallow = require('zustand/vanilla/shallow');

function useShallow(selector) {
  const prev = React.useRef(undefined);
  return (state) => {
    const next = selector(state);
    return shallow.shallow(prev.current, next) ? prev.current : prev.current = next;
  };
}

exports.useShallow = useShallow;
