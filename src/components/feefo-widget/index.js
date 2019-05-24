import { h, Component } from "preact";
import Stars, { Defs } from "./components/Stars";
import Button from "./components/Button";
import request from "./request";
import styles from "./style.scss";
import Logo from "./assets/logo.svg";
import ArrowLeft from "./assets/arrow-left.svg";
import ArrowRight from "./assets/arrow-right.svg";

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

							<Logo class={styles[`${baseClass}-header__logo`]} />
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
					<div class={styles[`${baseClass}-carousel`]}>
						<Button
							class={styles[`${baseClass}-button`]}
							disabled={current == 0}
							onClick={this.handlePrev}
							Icon={ArrowLeft}
							title="Prev"
						/>
						<div class={styles[`${baseClass}-reviews`]}>
							<div
								style={{
									transform: `translateX(-${(100 / perPage) *
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
										<div
											class={
												styles[`${baseClass}-review`]
											}
											style={{
												minWidth: `${100 / perPage}%`
											}}
										>
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
											{customer &&
												customer.display_name && (
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
						<Button
							class={styles[`${baseClass}-button`]}
							disabled={loading}
							onClick={this.handleNext}
							Icon={ArrowRight}
							title="Next"
						/>
					</div>
				) : null}
			</div>
		);
	}
}

export default class App extends Component {
	state = {
		perPage: 4
	};

	constructor(props) {
		super();
		this.timeout;
	}

	getPerPage = () => {
		const width =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;

		let perPage = 4;

		if (width < 768) {
			perPage = 2;
		}
		if (width < 425) {
			perPage = 1;
		}

		if (perPage != this.state.perPage) {
			this.setState({ perPage: perPage });
		}
	};

	componentDidMount = () => {
		window.addEventListener("resize", () => {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(this.getPerPage, 250);
		});

		this.getPerPage();
	};

	render() {
		const { perPage } = this.state;
		const { ...props } = this.props;

		return <Widget perPage={perPage} {...props} />;
	}
}
