import React, {Component, PropTypes} from 'react';
import styles from './index.scss';

class PlayerDetails extends Component {
	constructor() {
		super();

		this.state = {
			player1: '',
			player2: '',
			player3: '',
			player4: ''
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
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
		this.props.handleSubmit(players);
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
					<button type="submit" className={styles.submitBtn}>Play</button>
				</div>
			</form>
		)
	}
}

export default PlayerDetails;
