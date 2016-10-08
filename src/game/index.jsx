import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component, PropTypes} from 'react';
import SnakeLadderBoard from '../snakeLadderBoard/index.jsx';
import DiceRoller from '../diceRoller/index.jsx';
import Player from '../player/index.jsx';
import Dice from '../dice/index.jsx';
import PerfectThrows from '../perfectThrows/index.jsx';
import styles from './index.scss';

const CELL_HEIGHT = 58;
const CELL_WIDTH = 58;
const MAX_ROLL = 3;
const colors = ['red', 'green', 'yellow', 'blue'];

function capitalize(name) {
	return name.slice(0, 1).toUpperCase() + name.slice(1);
}

export default class Game extends Component {
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
			currentPlayerIndex: 0,
			playerTakingTurn: false,
			chances: [
				// {playerId: 1, diceValue: 4}
			],
			winners: []
		};

		this.onDiceRoll = this.onDiceRoll.bind(this);
		this.onPlayerMove = this.onPlayerMove.bind(this);
		this.getPlayerPosition = this.getPlayerPosition.bind(this);
	}

	onDiceRoll(value) {
		let playerId = this.props.players[this.state.currentPlayerIndex].id;
		let newPosition = this.state.positions[playerId] + value;

		if (newPosition <= 100) {
			this.movePlayerTo(playerId, newPosition);
		} else {
			// Move chance to next player
			this.nextTurn();
		}
	}

	onPlayerMove(playerId, position) {
		let newPosition;

		let positionKey = position.toString();

		if (this.props.snakes[positionKey]) {
			newPosition = this.props.snakes[positionKey];
		} else if (this.props.ladders[positionKey]) {
			newPosition = this.props.ladders[positionKey];
		}

		if (newPosition) {
			this.movePlayerTo(playerId, newPosition);
		} else {
			if (this.playerReachedTop(position)) {
				let newWinners = this.state.winners.concat(playerId);

				// player reached the destination
				this.setState({
					winners: newWinners
				});

				let winnerName = this.props.players[this.state.currentPlayerIndex].name;

				if (newWinners.length + 1 === this.props.players.length) {
					this.setState({gameOver: true});
					alert(`${winnerName} Completed, Game Over!`);
				} else {
					alert(`${winnerName} Completed!`);
					// Move chance to next player
					this.nextTurn();
				}
			} else {
				// Move chance to next player
				this.nextTurn();
			}
		}
	}

	playerReachedTop(position) {
		return position === 100;
	}

	movePlayerTo(playerId, newPosition) {
		let newPositions = Object.assign(this.state.positions, {
			[playerId]: newPosition
		});

		this.setState({positions: newPositions, playerTakingTurn: true});
	}

	nextTurn() {
		let nextPlayerIndex = (this.state.currentPlayerIndex + 1) % this.props.players.length;

		while(this.state.winners.indexOf(nextPlayerIndex) !== -1) {
			nextPlayerIndex = (nextPlayerIndex + 1) % this.props.players.length;
		}
		this.setState({
			currentPlayerIndex: nextPlayerIndex,
			playerTakingTurn: false
		});
	}

	getPlayerPosition(playerIndex) {
		let currentPlayer = this.props.players[playerIndex];
		return this.state.positions[currentPlayer.id];
	}

	render() {
		let {ladders, snakes} = this.props;
		let playerName = this.props.players[this.state.currentPlayerIndex].name;
		return (
			<div className="container">
				<h1>Ladders & Snake Board Game</h1>
				<div>
					<SnakeLadderBoard ladders={ladders} snakes={snakes}>
						{this.props.players.map((player, index) => (
							<Player {...player}
								key={player.id}
								color={colors[index]}
								position={this.state.positions[player.id]}
								onPlayerMove={this.onPlayerMove}
								cellWidth={CELL_WIDTH}
								cellHeight={CELL_HEIGHT}/>
						))}
					</SnakeLadderBoard>
					<div className={styles.rightPanel}>
						<div className={styles.playerTitle}>{capitalize(playerName)}'s Turn</div>
						<DiceRoller
							maxRoll={MAX_ROLL}
							onDiceRoll={this.onDiceRoll}
							disabled={this.state.playerTakingTurn || this.state.gameOver} />

						<PerfectThrows
							currentPlayerIndex={this.state.currentPlayerIndex}
							getPlayerPosition={this.getPlayerPosition}
							snakes={this.props.snakes}
							ladders={this.props.ladders}
							maxRoll={MAX_ROLL} />
					</div>
				</div>
			</div>
		)
	}
}

Game.propTypes = {
	players: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired
	})),
	snakes: PropTypes.objectOf(PropTypes.number),
	ladders: PropTypes.objectOf(PropTypes.number)
};
