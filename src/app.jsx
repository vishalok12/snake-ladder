import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component, PropTypes} from 'react';
import Game from './game/index.jsx';
import PlayerDetails from './playerDetails/index.jsx';

const gameLevels = {
	GAME_START: 0,
	GAME_RUNNING: 1,
	GAME_FINISHED: 2
};

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playersCount: 2,
			players: [{name: 'Player 1', id: '1'}, {name: 'Player 2', id: '2'}],
			gameState: gameLevels.GAME_START,
			reverse: false
		};

		this.onPlayerSelect = this.onPlayerSelect.bind(this);
		this.onPlayerNamesSubmit = this.onPlayerNamesSubmit.bind(this);
	}

	onPlayerSelect(newPlayersCount) {
		this.setState({playersCount: newPlayersCount});
	}

	onPlayerNamesSubmit(players, reverse) {
		this.setState({players, reverse, gameState: gameLevels.GAME_RUNNING });
	}

	render() {
		const {ladders, snakes} = this.props;

		return (
			<div>
				{this.state.gameState === 0 ?
					<PlayerDetails
						playersCount={this.state.playersCount}
						onPlayerSelect={this.onPlayerSelect}
						handleSubmit={this.onPlayerNamesSubmit} /> :
					<Game
						ladders={ladders}
						snakes={snakes}
						players={this.state.players}
						reverse={this.state.reverse}/>
				}
			</div>
		)
	}
}

App.propTypes = {
	snakes: PropTypes.objectOf(PropTypes.number),
	ladders: PropTypes.objectOf(PropTypes.number)
};
