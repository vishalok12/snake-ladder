import React, {Component} from 'react';
import styles from './index.scss';

const BoardRow = (props) => {
	return (
		<div className="boardRow">
			{props.children}
		</div>
	)
};

const BoardCell = (props) => {
	let snakeOrLadder;
	let cellClass = styles.cell;

	if (props.snake) {
		snakeOrLadder = <div>S -> {props.snake}</div>
		cellClass += ' ' + styles.snake;
	} else if (props.ladder) {
		snakeOrLadder = <div>L -> {props.ladder}</div>
		cellClass += ' ' + styles.ladder;
	}
	return (
		<div className={cellClass}>
		  <span>{props.number}</span>
		  {snakeOrLadder}
		</div>
	)
}

class SnakeLadderBoard extends Component {
	// constructor() {
	// 	super();

	// 	this.state = {
	// 		players: [
	// 			{position: 1}
	// 		]
	// 	};
	// }
	render() {
		let {children, ladders, snakes} = this.props;
		let rows = [];

		for (let i=0; i < 10; i++) {
			let cells = [];
			for (let j = 0; j < 10; j++) {
				let cellProps = {
					number: i * 10 + j + 1
				};
				if (ladders[cellProps.number.toString()]) {
					cellProps.ladder = ladders[cellProps.number.toString()];
				} else if (snakes[cellProps.number.toString()]) {
					cellProps.snake = snakes[cellProps.number.toString()];
				}

				cells.push(<BoardCell {...cellProps} />);
			}

			cells = i % 2 ? cells.reverse() : cells;
			rows.push(<BoardRow children={cells} />);
		}

		return (
			<div className={styles.snakeLadderBoard}>
				{rows.reverse()}
				{children}
			</div>
		)
	}
}

export default SnakeLadderBoard
