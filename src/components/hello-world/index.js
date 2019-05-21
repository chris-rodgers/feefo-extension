import { h, Component } from "preact";
import request from "./request";
import "./style.scss";

export default class App extends Component {
	state = {
		rating: null
	};

	componentDidMount = () => {
		const { merchant_identifier } = this.props;
		request(
			`https://api.feefo.com/api/10/reviews/summary/all?merchant_identifier=${merchant_identifier}`
		).then(data => {
			const { rating } = JSON.parse(data.response).rating;
			this.setState({rating})
		});
	};

	render(props) {
    const {rating} = this.state;
		return (
			<div>
				<h1>Rating: {rating}</h1>
			</div>
		);
	}
}
