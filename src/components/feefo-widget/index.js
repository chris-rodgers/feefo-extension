import { h, Component } from "preact";
import Stars, { Defs } from "./components/Stars";
import request from "./request";
import styles from "./style.scss";
import logo from "./assets/logo.svg";
class Widget extends Component {
	state = {
		total: {
			rating: null,
			count: null
		},
		reviews: [],
		loading: false
	};

	componentDidMount = () => {
		const { reviews } = this.state;
		const { merchantIdentifier } = this.props;
		request(
			`https://api.feefo.com/api/10/reviews/summary/all?merchant_identifier=${merchantIdentifier}`
		).then(data => {
			const response = JSON.parse(data.response);
			const { rating } = response.rating;
			const { count } = response.meta;
			this.setState({ total: { ...this.state.total, rating, count } });
		});
		this.getReviews(reviews.length);
	};

	getReviews = page => {
		const { merchantIdentifier, perPage } = this.props;

		page = page + 1;

		this.setState({ loading: true });

		request(
			`https://api.feefo.com/api/10/reviews/service?merchant_identifier=${merchantIdentifier}&page_size=${perPage}&page=${page}&rating=4,5`
		).then(data => {
			const { reviews } = JSON.parse(data.response);
			this.setState({
				reviews: [...this.state.reviews, ...reviews],
				loading: false
			});
		});
	};

	render(props) {
		const { buttonClass, merchantIdentifier } = this.props;
		const { total, reviews, loading } = this.state;
		const baseClass = "feefo-widget";

		return (
			<div class={styles[baseClass]}>
				<Defs />
				{total.rating && (
					<div class={styles[`${baseClass}-header`]}>
						<div class={styles[`${baseClass}-header__title`]}>
							Average Customer Rating:
						</div>
						<div class={styles[`${baseClass}-header__stars`]}>
							<Stars rating={total.rating} />
						</div>
						<div class={styles[`${baseClass}-header__divider`]}>
							<div class={styles[`${baseClass}-header__rating`]}>
								<b>{total.rating}</b>/5
							</div>
							<img
								class={styles[`${baseClass}-header__logo`]}
								src={logo}
							/>
						</div>
						<div class={styles[`${baseClass}-header__text`]}>
							<b>Independent Service Rating</b> based on{" "}
							<b>{total.count}</b> verified reviews over the past
							year.{" "}
							<a
								href={`https://www.feefo.com/en-GB/reviews/${merchantIdentifier}`}
							>
								Read all reviews
							</a>
						</div>
					</div>
				)}
				<Defs />
				{reviews.length ? (
					<div class={styles[`${baseClass}-reviews`]}>
						{reviews.map(item => {
							const { rating } = item.service.rating;
							const { title, review } = item.service;

							return (
								<div class={styles[`${baseClass}-review`]}>
									<Stars
										class={
											styles[`${baseClass}-review__stars`]
										}
										rating={rating}
									/>
									{title && (
										<h3
											class={
												styles[
													`${baseClass}-review__title`
												]
											}
										>
											{title}
										</h3>
									)}
									<p
										class={
											styles[
												`${baseClass}-review__review`
											]
										}
									>
										{review}
									</p>
								</div>
							);
						})}
					</div>
				) : null}
				<div class={styles[`${baseClass}-button-container`]}>
					<button
						class={buttonClass}
						onClick={() => this.getReviews(reviews.length)}
						disabled={loading}
					>
						{loading ? "Loading" : "Load More"}
					</button>
				</div>
			</div>
		);
	}
}

export default ({ perPage = 4, ...rest }) => (
	<Widget perPage={perPage} {...rest} />
);
