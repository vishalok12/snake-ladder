import 'react-toggle/style.css';

import React, {Component, PropTypes} from 'react';
import styles from './index.scss';

import Toggle from 'react-toggle'

class PlayerDetails extends Component {
	constructor() {
		super();

		this.state = {
			player1: '',
			player2: '',
			player3: '',
			player4: '',
			isReverse: false
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleReverseChange = this.handleReverseChange.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();

		let players = [];

		for (let i = 1; i <= this.props.playersCount; i++) {
			players.push({
				id: i.toString(),
				name: this.state[`player${i}`]
			})
		}
		this.props.handleSubmit(players, this.state.isReverse);
	}

	handleReverseChange() {
		this.setState({ isReverse: !this.state.isReverse });
	}

	handleChange(e, index) {
		this.setState({[`player${index}`]: e.target.value});
	}

	render() {
		const {playersCount, onPlayerSelect} = this.props;

		let inputs = [];
		for (let i = 1; i <= playersCount; i++) {
			inputs.push(
				<div className={styles.playerInput}>
					<input
						key={i}
						type="text"
						value={this.state[`player${i}`]}
						onChange={(e) => this.handleChange(e, i)}
						placeholder={'Enter Player ' + i + ' Name'} />
				</div>
			)
		}

		return (
			<form onSubmit={this.handleSubmit}>
				<div className={styles.playersInfoContainer}>
					<div>
						<h2 className={styles.lbl}>Enter Players Name</h2>
						{inputs}
					</div>
					<div className={styles.playersSelectBtn}>
						{[2, 3, 4].map(pCount => (
							<div
								key={pCount}
								className={pCount === playersCount ? styles.playerSelectedBtn : styles.playerSelectBtn}
								onClick={() => {onPlayerSelect(pCount)}}>{pCount}P</div>
						))}
					</div>
					<div>
					  <Toggle
					    defaultChecked={this.state.isReverse}
					    onChange={this.handleReverseChange} />
					  <span className={styles.reverseLabel}>Play Reverse</span>
					</div>
					<button type="submit" className={styles.submitBtn}>Play</button>
				</div>
			</form>
		)
	}
}

PlayerDetails.defaultProps = {
	playersCount: 2
};

PlayerDetails.propTypes = {
	playersCount: PropTypes.number,
	handleSubmit: PropTypes.func.isRequired,
	onPlayerSelect: PropTypes.func.isRequired
};

export default PlayerDetails;
