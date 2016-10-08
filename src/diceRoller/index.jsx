import React, {Component, PropTypes} from 'react';
import styles from './index.scss';

let TIMEOUT_PERIOD = 100;

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
		} else if (newDiceValue === 6 && this.state.pastChanceValues.length < this.props.maxRoll-1) {
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
			<div style={{textAlign: 'center'}}>
				<Dice value={diceValue}/>
				<button
						disabled={rolling || disabled ? 'disabled': ''}
						className={styles.diceRollButton}
						onClick={this.rollDice}>
					{rolling ? "Rolling..." : (nextChance ? "Roll Again" : "Roll it")}
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

const Dice = ({value}) => {
	let diceWidth = 80,
			diceHeight = 80,
			dotWidth = 8,
			dotHeight = 8;

	let diceDots = [(
				<div
					key="1"
					style={
						{left: `${0.2*diceWidth - 0.5*dotWidth}px`,
						top: `${0.2*diceHeight - 0.5*dotHeight}px`}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="2"
					style={
						{right: `${0.2*diceWidth - 0.5*dotWidth}px`,
						top: `${0.2*diceHeight - 0.5*dotHeight}px`}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="3"
					style={
						{left: `${0.2*diceWidth - 0.5*dotWidth}px`,
						top: `${0.5*diceHeight - 0.5*dotHeight}px`}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="4"
					style={
						{left: `${0.5*diceWidth - 0.5*dotWidth}px`,
						top: `${0.5*diceHeight - 0.5*dotHeight}px`}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="5"
					style={
						{right: `${0.2*diceWidth - 0.5*dotWidth}px`,
						top: `${0.5*diceHeight - 0.5*dotHeight}px`}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="6"
					style={
						{left: `${0.2*diceWidth - 0.5*dotWidth}px`,
						bottom: `${0.2*diceHeight - 0.5*dotHeight}px`}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="7"
					style={
						{right: `${0.2*diceWidth - 0.5*dotWidth}px`,
						bottom: `${0.2*diceHeight - 0.5*dotHeight}px`}
					}
					className={styles.dot}>
				</div>
			)];

	switch(value) {
		case 1:
			diceDots = diceDots.slice(3,4);
			break;
		case 2:
			diceDots = diceDots.filter((dot, i) => [0, 6].indexOf(i) + 1);
			break;
		case 3:
			diceDots = diceDots.filter((dot, i) => [0, 3, 6].indexOf(i) + 1);
			break;
		case 4:
			diceDots = diceDots.filter((dot, i) => [0, 1, 5, 6].indexOf(i) + 1);
			break;
		case 5:
			diceDots = diceDots.filter((dot, i) => [0, 1, 3, 5, 6].indexOf(i) + 1);
			break;
		case 6:
			diceDots = diceDots.filter((dot, i) => [0, 1, 2, 4, 5, 6].indexOf(i) + 1);
			break;
	}

	return (
		<div className={styles.dice}>
			{diceDots}
		</div>
	);
}

Dice.propTypes = {
	value: PropTypes.number.isRequired
};

function getRandomBetween(min, max, {except}={}) {
	if (min > max) {
		let temp = min;
		min = max;
		max = temp;
	}
	let value = Math.floor(Math.random()*(max-min+1)+min);
	if (!except) {
	  return value;
	}

	while (value === except) {
		value = Math.floor(Math.random()*(max-min+1)+min);
	}

	return value;
}

export default DiceRoller
