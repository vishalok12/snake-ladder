import React, {Component, PropTypes} from 'react';
import Dice from '../dice/index.jsx';
import styles from './index.scss';

const getThrows = (value) => {
	let throws = [];

	while (value > 6) {
		value -= 6;
		throws.push(6);
	}

	if (value) {
		throws.push(value);
	}

	return throws;
};

class PerfectThrows extends Component {
	constructor(props) {
		super(props);

		this.getBestThrows = this.getBestThrows.bind(this);

		this.state = {
			bestThrowsMap: this.getBestThrowsMap()
		};
	}

	getBestThrows() {
		let position = this.props.getPlayerPosition(this.props.currentPlayerIndex);

		let bestThrowsMap = this.state.bestThrowsMap;

		let {snakes, ladders} = this.props;
		let max = this.getMax();
		let bestThrows = [];
		let current = position;

		while(current !== max) {
			let nextPosition = bestThrowsMap[current].parent;
			bestThrows.push(getThrows(Math.abs(nextPosition - current)));

			if (snakes[nextPosition.toString()]) {
				current = snakes[nextPosition.toString()];
			} else if (ladders[nextPosition.toString()]) {
				current = ladders[nextPosition.toString()];
			} else {
				current = nextPosition;
			}
		}

		return bestThrows;
	}

	findLaddersOrSnakesBetween(pos1, pos2) {
		if (pos1 > pos2) {
			let temp = pos1;
			pos1 = pos2;
			pos2 = temp;
		}

		let ladderOrSnakePositions = [];

		for (var i = pos1; i <= pos2; i++) {
			if (this.props.ladders[i.toString()]) {
				ladderOrSnakePositions.push(i);
			// } else if (this.props.snakes[i.toString()]) {
			// 	ladderOrSnakePositions.push(i);
			}
		}

		return ladderOrSnakePositions;
	}

	shouldComponentUpdate(nextProps) {
		return this.props.currentPlayerIndex !== nextProps.currentPlayerIndex;
	}

	getNewPosition(currentPosition, value) {
		return this.props.reverse ? currentPosition - value :
			currentPosition + value;
	}

	inDestination(position) {
		return position === this.getMax();
	}

	canReachInOneThrow(pos1, pos2) {
		let value = Math.abs(pos1 - pos2);
		return value < 18 && !(value % 6 === 0 && value % 18 !== 0);
	}

	getMax() {
		return this.props.reverse ? 1 : 100;
	}

	moveBackByStep(position, step) {
		return this.props.reverse ? position + step : position - step;
	}

	getBestThrowsMap() {
		let bestThrows = [];
		let queue = [];

		for (let i = 0; i <= 101; i++) {
			bestThrows[i] = {
				distance: Infinity,
				parent: null
			};
		}

		let root = this.getMax();
		bestThrows[root].distance = 0;

		queue.push(this.getMax());

		let current;
		while(queue.length) {
			current = queue.shift();
			let adjacentNodes = this.getAdjacent(current);

			for (let i = 0; i < adjacentNodes.length; i++) {
				let n = adjacentNodes[i];
				if (bestThrows[n].distance === Infinity) {
					bestThrows[n] = {
						distance: bestThrows[current].distance + 1,
						parent: current
					}

					queue.push(n);
				}
			}
		}

		return bestThrows;
	}

	getAdjacent(position) {
		let adjacentNodes = [];

		let {snakes, ladders, maxRoll} = this.props;
		let maxShift = maxRoll * 6;

		let i = 1;
		while(i <= maxShift) {
			let adjacentNode = this.getNewPosition(position, -i);

			if (i % 6 === 0 && i % 18 !== 0) { i++; continue; }
			if (adjacentNode > 101 || adjacentNode < 0) { i++; continue; }

			adjacentNodes.push(adjacentNode);

			let adjacentNodeWithSnake = this.findSnakePositionWithDestination(adjacentNode);
			let adjacentNodeWithLadder = this.findLadderPositionWithDestination(adjacentNode);

			if (adjacentNodeWithSnake) {
				adjacentNodes.push(parseInt(adjacentNodeWithSnake));
			}

			if (adjacentNodeWithLadder) {
				adjacentNodes.push(parseInt(adjacentNodeWithLadder));
			}

			i++;
		}

		return adjacentNodes;
	}

	findSnakePositionWithDestination(position) {
		let snakes = this.props.snakes;
		let snakeKeys = Object.keys(snakes);

		return snakeKeys.find(key => snakes[key] === position);
	}

	findLadderPositionWithDestination(position) {
		let ladders = this.props.ladders;
		let keys = Object.keys(ladders);

		return keys.find(key => ladders[key] === position);
	}

	// getBestThrows(position) {
	// 	let {snakes, ladders, maxRoll, getPlayerPosition} = this.props;
	// 	let nextPositionsFromCurrent,
	// 		bestThrowsFromNextPositions,
	// 		minThrow,
	// 		nextPosition;

	// 	if (typeof position === 'undefined') {
	// 		position = getPlayerPosition(this.props.currentPlayerIndex);
	// 	}

	// 	let highestPositionFromCurrent = this.getNewPosition(position, maxRoll * 6);
	// 	let maxPosition = highestPositionFromCurrent;
	// 	while (maxPosition > position &&
	// 			(snakes[maxPosition.toString()] || ladders[maxPosition.toString()])) {
	// 		maxPosition = this.moveBackByStep(maxPosition, 1);
	// 	}

	// 	if (this.inDestination(position)) {
	// 		return {distance: 0, throws: []};
	// 	}

	// 	if (this.canReachInOneThrow(position, maxPosition)) {
	// 		// console.log(position, '->', 100);
	// 		return {distance: 1, throws: [getThrows(Math.abs(this.getMax() - position))]};
	// 	}

	// 	let laddersOrSnakesBetweenCurrentToMax = this.findLaddersOrSnakesBetween(position, highestPositionFromCurrent)
	// 		.filter(ladderOrSnakePosition => Math.abs(ladderOrSnakePosition - position) % 6);

	// 	if (laddersOrSnakesBetweenCurrentToMax.length) {
	// 		// queue.push(maxPosition);
	// 		nextPositionsFromCurrent = laddersOrSnakesBetweenCurrentToMax.map(key => {
	// 			return ladders[key] || snakes[key];
	// 		});

	// 		// .filter(position => position > maxPosition);
	// 		// nextPositionsFromCurrent.push(maxPosition);

	// 		bestThrowsFromNextPositions = nextPositionsFromCurrent
	// 			.map(position => this.getBestThrows(parseInt(position)));

	// 		minThrow = bestThrowsFromNextPositions[0];
	// 		nextPosition = laddersOrSnakesBetweenCurrentToMax[0];
	// 		for (let i = 1; i < bestThrowsFromNextPositions.length; i++) {
	// 			if (minThrow.distance > bestThrowsFromNextPositions[i].distance) {
	// 				minThrow = bestThrowsFromNextPositions[i];
	// 				nextPosition = laddersOrSnakesBetweenCurrentToMax[i];
	// 			}
	// 		}
	// 	}

	// 	let minThrowFromMaxPosition = this.getBestThrows(maxPosition);
	// 	if (!minThrow || minThrowFromMaxPosition.distance < minThrow.distance) {
	// 		// console.log(position, '->', maxPosition);
	// 		return {distance: minThrowFromMaxPosition.distance + 1, throws: [getThrows(maxPosition - position)].concat(minThrowFromMaxPosition.throws)};
	// 	}

	// 	// console.log(position, '->', nextPosition, '->', this.props.ladders[nextPosition.toString()]);

	// 	return {distance: minThrow.distance + 1, throws: [getThrows(nextPosition - position)].concat(minThrow.throws)};
	// }

	render() {
		return (
			<div className={styles.futureThrowsContainer}>
				<label>Perfect Throws</label>
				{this.getBestThrows().map((diceThrows, i) => (
					<div className={styles.stepThrows}>
						{diceThrows.map((diceThrow, j) => <Dice key={'d-' + i + j} value={diceThrow} diceWidth={40} dotWidth={4}/>)}
					</div>
				))}
			</div>
		);
	}
}

PerfectThrows.PropTypes = {
	snakes: PropTypes.objectOf(PropTypes.number).isRequired,
	ladders: PropTypes.objectOf(PropTypes.number).isRequired,
	maxRoll: PropTypes.number.isRequired,
	currentPlayerIndex: PropTypes.number.isRequired,
	getPlayerPosition: PropTypes.func.isRequired
};

export default PerfectThrows;
