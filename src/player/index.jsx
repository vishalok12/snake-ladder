import React, {Component} from 'react';
import styles from './index.scss';

class Player extends Component {
	constructor() {
		super();
		this.state = {};

		this.getPositionOnBoard = this.getPositionOnBoard.bind(this);
		this.handleTransition = this.handleTransition.bind(this);
	}

	getPositionOnBoard() {
		let {position, cellWidth, cellHeight} = this.props;
		let playerRowInBoard = Math.floor((position - 1) / 10) + 1;
		let playerColumnInBoard = playerRowInBoard % 2 ?
			(position - 1) % 10 + 1 : 10 - (position - 1) % 10;

		console.log(playerRowInBoard, playerColumnInBoard, position)

		return {
			transform: `translate(${(playerColumnInBoard - 1) * cellWidth}px, ${(10-playerRowInBoard) * cellHeight}px)`,
		}
	}

	handleTransition() {
		this.props.onPlayerMove(this.props.id, this.props.position);
	}

	render() {
		return (
			<div
				onTransitionEnd={this.handleTransition}
				style={this.getPositionOnBoard()}
				className={styles.player}>
			</div>
		)
	}
}

export default Player
