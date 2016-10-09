import React, {PropTypes} from 'react';
import styles from './index.scss';

const BoardRow = (props) => {
	return (
		<div className="boardRow">
			{props.children}
		</div>
	)
};

BoardRow.propTypes = {
	children: PropTypes.arrayOf(PropTypes.element)
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
};

BoardCell.propTypes = {
	number: PropTypes.number.isRequired,
	snake: PropTypes.number,
	ladder: PropTypes.number
};

const SnakeLadderBoard = ({children, ladders, snakes}) => {
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

			cells.push(<BoardCell key={`cell-${i}-${j}`} {...cellProps} />);
		}

		cells = i % 2 ? cells.reverse() : cells;
		rows.push(<BoardRow key={`row-${i}`} children={cells} />);
	}

	return (
		<div className={styles.snakeLadderBoard}>
			{rows.reverse()}
			<div className={styles.startPoint}></div>
			{children}
		</div>
	);
}

SnakeLadderBoard.propTypes = {
	children: PropTypes.arrayOf(PropTypes.element.isRequired),
	ladders: PropTypes.objectOf(PropTypes.number),
	snakes: PropTypes.objectOf(PropTypes.number)
};

export default SnakeLadderBoard
