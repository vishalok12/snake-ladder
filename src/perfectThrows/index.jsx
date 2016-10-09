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
	constructor() {
		super();

		this.getBestThrows = this.getBestThrows.bind(this);
	}

	findLaddersBetween(pos1, pos2) {
		let ladderPositions = [];

		for (var i = pos1; i <= pos2; i++) {
			if (this.props.ladders[i.toString()]) {
				ladderPositions.push(i);
			}
		}

		return ladderPositions;
	}

	shouldComponentUpdate(nextProps) {
		return this.props.currentPlayerIndex !== nextProps.currentPlayerIndex;
	}

	getBestThrows(position) {
		let {snakes, ladders, maxRoll, getPlayerPosition} = this.props;
		let nextPositionsFromCurrent,
			bestThrowsFromNextPositions,
			minThrow,
			nextPosition;

		if (typeof position === 'undefined') {
			position = getPlayerPosition(this.props.currentPlayerIndex);
		}

		let maxPosition = position + maxRoll * 6;
		while (maxPosition > position && snakes[maxPosition.toString()]) {
			maxPosition -= 1;
		}

		if (position === 100) {
			return {distance: 0, throws: []};
		}

		if (maxPosition >= 100) {
			// console.log(position, '->', 100);
			return {distance: 1, throws: [getThrows(100 - position)]};
		}

		let laddersBetweenCurrentToMax = this.findLaddersBetween(position + 1, maxPosition)
			.filter(ladderPosition => (ladderPosition - position) % 6);

		if (laddersBetweenCurrentToMax.length) {
			// queue.push(maxPosition);
			nextPositionsFromCurrent = laddersBetweenCurrentToMax.map(ladderKey => {
				return ladders[ladderKey];
			})
			// .filter(position => position > maxPosition);
			// nextPositionsFromCurrent.push(maxPosition);

			bestThrowsFromNextPositions = nextPositionsFromCurrent
				.map(position => this.getBestThrows(parseInt(position)));

			minThrow = bestThrowsFromNextPositions[0];
			nextPosition = laddersBetweenCurrentToMax[0];
			for (let i = 1; i < bestThrowsFromNextPositions.length; i++) {
				if (minThrow.distance > bestThrowsFromNextPositions[i].distance) {
					minThrow = bestThrowsFromNextPositions[i];
					nextPosition = laddersBetweenCurrentToMax[i];
				}
			}
		}

		let minThrowFromMaxPosition = this.getBestThrows(maxPosition);
		if (!minThrow || minThrowFromMaxPosition.distance < minThrow.distance) {
			// console.log(position, '->', maxPosition);
			return {distance: minThrowFromMaxPosition.distance + 1, throws: [getThrows(maxPosition - position)].concat(minThrowFromMaxPosition.throws)};
		}

		// console.log(position, '->', nextPosition, '->', this.props.ladders[nextPosition.toString()]);

		return {distance: minThrow.distance + 1, throws: [getThrows(nextPosition - position)].concat(minThrow.throws)};
	}

	render() {
		return (
			<div className={styles.futureThrowsContainer}>
				<label>Perfect Throws</label>
				{this.getBestThrows().throws.map((diceThrows, i) => (
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
