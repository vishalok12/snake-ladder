import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import SnakeLadderBoard from './snakeLadderBoard/index.jsx';
import DiceRoller from './diceRoller/index.jsx';
import Player from './player/index.jsx';
import styles from './index.scss';

const CELL_HEIGHT = 58;
const CELL_WIDTH = 58;

export default class App extends React.Component {
	constructor(props) {
		super(props);

		let initialPositions = {};

		this.props.players.reduce((obj, p) => {
			obj[p.id] = 0;
			return obj;
		}, initialPositions);

		this.state = {
			positions: initialPositions,
			gameOver: false,
			currentTurn: 1,
			chances: [
				// {playerId: 1, diceValue: 4}
			]
		};

		this.onDiceRoll = this.onDiceRoll.bind(this);
		this.onPlayerMove = this.onPlayerMove.bind(this);
	}

	onDiceRoll(value) {
		let playerId = this.state.currentTurn;
		let newPosition = this.state.positions[playerId] + value;

		if (newPosition <= 100) {
			this.movePlayerTo(playerId, newPosition);
		} else {
			// Move chance to next player
		}
	}

	onPlayerMove(playerId, position) {
		let newPosition;

		position = position.toString();

		if (this.props.snakes[position]) {
			newPosition = this.props.snakes[position];
		} else if (this.props.ladders[position]) {
			newPosition = this.props.ladders[position];
		}

		if (newPosition) {
			this.movePlayerTo(playerId, newPosition);
		}
	}

	movePlayerTo(playerId, newPosition) {
		let newPositions = Object.assign(this.state.positions, {
			[playerId]: newPosition
		});

		this.setState({positions: newPositions});
	}

	movePlayerBy(playerId, steps) {
		let newPositions = Object.assign(this.state.positions, {
			[playerId]: this.state.positions[playerId] + steps
		});

		this.setState({positions: newPositions});
	}

	render() {
		let {ladders, snakes} = this.props;
		return (
			<div>
				<h1>Ladders & Snake Board Game</h1>
				<div>
					<SnakeLadderBoard ladders={ladders} snakes={snakes}>
						{this.props.players.map(player => (
							<Player {...player}
								position={this.state.positions[player.id]}
								onPlayerMove={this.onPlayerMove}
								cellWidth={CELL_WIDTH}
								cellHeight={CELL_HEIGHT}/>
						))}
					</SnakeLadderBoard>
					<div className={styles.rightPanel}>
						<DiceRoller onDiceRoll={this.onDiceRoll} />
					</div>
				</div>
			</div>
		)
	}
}
