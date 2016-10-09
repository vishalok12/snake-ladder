import React, {PropTypes} from 'react';
import styles from './index.scss';

const Dice = ({value, diceWidth, dotWidth}) => {
	let diceHeight = diceWidth,
			dotHeight = dotWidth;

	let diceDots = [(
				<div
					key="1"
					style={
						{
							width: `${dotWidth}px`,
							height: `${dotHeight}px`,
							left: `${0.2 * diceWidth - 0.5 * dotWidth}px`,
							top: `${0.2 * diceHeight - 0.5 * dotHeight}px`
						}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="2"
					style={
						{
							width: `${dotWidth}px`,
							height: `${dotHeight}px`,
							right: `${0.2 * diceWidth - 0.5 * dotWidth}px`,
							top: `${0.2 * diceHeight - 0.5 * dotHeight}px`
						}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="3"
					style={
						{
							width: `${dotWidth}px`,
							height: `${dotHeight}px`,
							left: `${0.2 * diceWidth - 0.5 * dotWidth}px`,
							top: `${0.5 * diceHeight - 0.5 * dotHeight}px`
						}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="4"
					style={
						{
							width: `${dotWidth}px`,
							height: `${dotHeight}px`,
							left: `${0.5 * diceWidth - 0.5 * dotWidth}px`,
							top: `${0.5 * diceHeight - 0.5 * dotHeight}px`
						}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="5"
					style={
						{
							width: `${dotWidth}px`,
							height: `${dotHeight}px`,
							right: `${0.2 * diceWidth - 0.5 * dotWidth}px`,
							top: `${0.5 * diceHeight - 0.5 * dotHeight}px`
						}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="6"
					style={
						{
							width: `${dotWidth}px`,
							height: `${dotHeight}px`,
							left: `${0.2 * diceWidth - 0.5 * dotWidth}px`,
							bottom: `${0.2 * diceHeight - 0.5 * dotHeight}px`
						}
					}
					className={styles.dot}>
				</div>
			), (
				<div
					key="7"
					style={
						{
							width: `${dotWidth}px`,
							height: `${dotHeight}px`,
							right: `${0.2 * diceWidth - 0.5 * dotWidth}px`,
							bottom: `${0.2 * diceHeight - 0.5 * dotHeight}px`
						}
					}
					className={styles.dot}>
				</div>
			)];

	switch(value) {
		case 1:
			diceDots = diceDots.slice(3, 4);
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
		<div className={styles.dice} style={{width: diceWidth, height: diceHeight}}>
			{diceDots}
		</div>
	);
}

Dice.defaultProps = {
	diceWidth: 80,
	dotWidth: 8
};

Dice.propTypes = {
	value: PropTypes.number.isRequired,
	diceWidth: PropTypes.number,
	dotWidth: PropTypes.number
};

export default Dice
