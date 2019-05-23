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
		current: 0,
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

	getReviews = (page, cb) => {
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
			cb && cb();
		});
	};

	handlePrev = () => {
		this.setState({ current: this.state.current - 1 });
	};

	handleNext = () => {
		const { reviews, current } = this.state;
		const { perPage } = this.props;
		var nextItem = () => this.setState({ current: this.state.current + 1 });
		if (current == reviews.length - perPage) {
			this.setState({ loading: true });
			this.getReviews(reviews.length, nextItem);
		} else {
			nextItem();
		}
	};

	render(props) {
		const { buttonClass, merchantIdentifier, perPage } = this.props;
		const { total, reviews, loading, current } = this.state;
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
						<div
							style={{
								width: `${(reviews.length / perPage) * 100}%`,
								transform: `translateX(-${(100 /
									reviews.length) *
									current}%)`
							}}
							class={styles[`${baseClass}-reviews__inner`]}
						>
							{reviews.map(item => {
								const { customer } = item;
								const { rating } = item.service.rating;
								let { title, review } = item.service;
								const reviewLength = 100;
								let url = null;
								if (review.length > reviewLength) {
									review = `${review.substring(
										0,
										reviewLength
									)}...`;
									url = item.url;
								}

								return (
									<div class={styles[`${baseClass}-review`]}>
										<Stars
											class={
												styles[
													`${baseClass}-review__stars`
												]
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
											{review}{" "}
											{url && (
												<a
													class={
														styles[
															`${baseClass}-review__read-more`
														]
													}
													href={url}
													target="_blank"
												>
													Read More
												</a>
											)}
										</p>
										{customer && customer.display_name && (
											<p
												class={
													styles[
														`${baseClass}-review__display-name`
													]
												}
											>
												{customer.display_name}
											</p>
										)}
									</div>
								);
							})}
						</div>
					</div>
				) : null}
				<div class={styles[`${baseClass}-button-container`]}>
					<button disabled={current == 0} onClick={this.handlePrev}>
						Prev
					</button>

					<button disabled={loading} onClick={this.handleNext}>
						Next
					</button>
				</div>
			</div>
		);
	}
}

export default ({ perPage = 4, ...rest }) => (
	<Widget perPage={perPage} {...rest} />
);
