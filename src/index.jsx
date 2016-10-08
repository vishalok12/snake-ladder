import React from 'react';
import { render } from 'react-dom';
import App from './app.jsx';

const ladders = {'8': 31, '15': 97, '42': 81, '66': 87};
const snakes = {'24': 1, '55': 13, '71': 29, '88': 67, '99': 6};
const players = [{name: 'Player 1', id: '1'}, {name: 'Player 2', id: '2'}];

render(<App ladders={ladders} snakes={snakes} players={players}/>,
	document.querySelector("#app"));
