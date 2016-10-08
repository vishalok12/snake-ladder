import React, {Component, PropTypes} from 'react';
import styles from './index.scss';

const xOffset = -11;
const yOffset = -79;

const Player = (props) => {
	let {position, cellWidth, cellHeight} = props;
	let playerRowInBoard = Math.floor((position - 1) / 10) + 1;
	let playerColumnInBoard = playerRowInBoard % 2 ?
		(position - 1) % 10 + 1 : 10 - (position - 1) % 10;

	let xPosition = (playerColumnInBoard - 1) * cellWidth + xOffset;
	let yPosition = yOffset - (playerRowInBoard - 1) * cellHeight;
	let playerPositionStyle = {
		transform: `translate(${xPosition}px, ${yPosition}px)`,
	}

	const handleTransition = () => {
		props.onPlayerMove(props.id, props.position);
	}

	return (
		<div
			onTransitionEnd={handleTransition}
			style={position > 0 ? playerPositionStyle : {}}
			className={`${styles.player} ${styles[props.color]}`}>
		</div>
	);
}

Player.propTypes = {
	id: PropTypes.string.isRequired,
	position: PropTypes.number.isRequired,
	cellWidth: PropTypes.number.isRequired,
	cellHeight: PropTypes.number.isRequired,
	color: PropTypes.oneOf(['red', 'green', 'yellow', 'blue']).isRequired,
	onPlayerMove: PropTypes.func.isRequired
};

export default Player
