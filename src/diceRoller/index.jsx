import React, {Component, PropTypes} from 'react';
import Dice from '../dice/index.jsx';
import styles from './index.scss';

let TIMEOUT_PERIOD = 100;

function getRandomBetween(min, max, {except}={}) {
	if (min > max) {
		let temp = min;
		min = max;
		max = temp;
	}
	let value = Math.floor(Math.random() * (max - min + 1) + min);
	if (!except) {
	  return value;
	}

	while (value === except) {
		value = Math.floor(Math.random() * (max - min + 1) + min);
	}

	return value;
}

class DiceRoller extends Component {
	constructor() {
		super();
		this.state = {
			rolling: false,
			diceValue: 1,
			nextChance: false,
			pastChanceValues: []
		}
		this.rollDice = this.rollDice.bind(this);
	}

	rollDice() {
		this.setState({
			nextChance: false,
			rolling: getRandomBetween(5, 10)
		});

		setTimeout(() => this.getNewDiceValue(), TIMEOUT_PERIOD);
	}

	getNewDiceValue() {
		let newDiceValue = getRandomBetween(1, 6, {except: this.state.diceValue});

		this.setState({
			rolling: this.state.rolling - 1,
			diceValue: newDiceValue
		});

		if (this.state.rolling) {
			setTimeout(() => this.getNewDiceValue(), TIMEOUT_PERIOD);
		} else if (newDiceValue === 6 && this.state.pastChanceValues.length < this.props.maxRoll - 1) {
			this.setState({
				pastChanceValues: this.state.pastChanceValues.concat(newDiceValue),
				nextChance: true
			});
		} else {
			let totalDiceValue = newDiceValue + this.state.pastChanceValues.reduce((sum, v) => sum + v, 0);
			this.props.onDiceRoll(totalDiceValue);
			this.setState({pastChanceValues: []})
		}
	}

	render() {
		let {rolling, diceValue, nextChance} = this.state;
		let {disabled} = this.props;

		return (
			<div className={styles.diceRoller}>
				<Dice value={diceValue}/>
				<button
						disabled={rolling || disabled ? 'disabled' : ''}
						className={styles.diceRollButton}
						onClick={this.rollDice}>
					{rolling ? 'Rolling...' : (nextChance ? 'Roll Again' : 'Roll it')}
				</button>
			</div>
		)
	}
}

DiceRoller.propTypes = {
	maxRoll: PropTypes.number.isRequired,
	disabled: PropTypes.bool,
	onDiceRoll: PropTypes.func.isRequired
};

export default DiceRoller
