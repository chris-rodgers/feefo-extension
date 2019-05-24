const Container = ({...props, children }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 110 22"
		width="110"
		height="22"
        {...props}
	>
		{children}
	</svg>
);

export const Defs = ({ children }) => (
	<Container style="position: absolute; left: -9999px">
		<defs>
			<path
				fill="currentColor"
				id="feefo-widget-inside"
				d="M80.8 13l.9 5.2-4.7-2.5-4.6 2.4.9-5.2-3.8-3.7 5.2-.8L77 3.8l2.3 4.7 5.2.8-3.7 3.7zm22 0l.9 5.2-4.7-2.5-4.6 2.4.9-5.2-3.8-3.7 5.2-.8L99 3.8l2.3 4.7 5.2.8-3.7 3.7zm-44 0l.9 5.2-4.7-2.5-4.6 2.4.9-5.2-3.8-3.7 5.2-.8L55 3.8l2.3 4.7 5.2.8-3.7 3.7zm-22 0l.9 5.2-4.7-2.5-4.6 2.4.9-5.2-3.8-3.7 5.2-.8L33 3.8l2.3 4.7 5.2.8-3.7 3.7zm-22 0l.9 5.2-4.7-2.5-4.6 2.4.8-5.1-3.7-3.7 5.2-.8L11 3.8l2.3 4.7 5.2.8-3.7 3.7z"
			/>
			<path
				fill="currentColor"
				id="feefo-widget-outside"
				d="M86 7.8L80.5 7l-2.4-4.9c-.4-.9-1.7-.9-2.1 0L73.5 7l-5.5.8c-1 .1-1.4 1.3-.7 2l4 3.9-.9 5.4c-.2 1 .9 1.7 1.7 1.3l4.9-2.6 4.9 2.6c.9.5 1.9-.3 1.7-1.3l-.9-5.4 4-3.9c.6-.6.3-1.8-.7-2zm22 0l-5.5-.8-2.4-4.9c-.4-.9-1.7-.9-2.1 0L95.5 7l-5.5.8c-1 .1-1.4 1.3-.7 2l4 3.9-.9 5.4c-.2 1 .9 1.7 1.7 1.3l4.9-2.6 4.9 2.6c.9.5 1.9-.3 1.7-1.3l-.9-5.4 4-3.9c.6-.6.3-1.8-.7-2zm-44 0L58.5 7l-2.4-4.9c-.4-.9-1.7-.9-2.1 0L51.5 7l-5.5.8c-1 .1-1.4 1.3-.7 2l4 3.9-.9 5.4c-.2 1 .9 1.7 1.7 1.3l4.9-2.6 4.9 2.6c.9.5 1.9-.3 1.7-1.3l-.9-5.4 4-3.9c.6-.6.3-1.8-.7-2zm-22 0L36.5 7l-2.4-4.9c-.4-.9-1.7-.9-2.1 0L29.5 7l-5.5.8c-1 .1-1.4 1.3-.7 2l4 3.9-.9 5.4c-.2 1 .9 1.7 1.7 1.3l4.9-2.6 4.9 2.6c.9.5 1.9-.3 1.7-1.3l-.9-5.4 4-3.9c.6-.6.3-1.8-.7-2zm-22 0L14.5 7l-2.4-4.9c-.4-.9-1.7-.9-2.1 0L7.5 7 2 7.8C1 8 .7 9.2 1.4 9.9l4 3.9-.9 5.4c-.2 1 .9 1.7 1.7 1.3l4.9-2.6 4.9 2.6c.9.5 1.9-.3 1.7-1.3l-.9-5.4 4-3.9c.5-.7.2-1.9-.8-2.1z"
            />
			<clipPath id="clip">
				<use overflow="visible" xlinkHref="#feefo-widget-inside" />
			</clipPath>
			<mask id="mask">
				<use
					style="color: white"
					overflow="visible"
					xlinkHref="#feefo-widget-outside"
				/>
				<use
					style="color: black"
					overflow="visible"
                    xlinkHref="#feefo-widget-inside"
                    stroke="white"
                    stroke-width="0.5px"
				/>
			</mask>
		</defs>
	</Container>
);

const Stars = ({...props, rating}) => {
    const color = "#ffd000";
    const width = (110 / 5) * rating;
    return (
        <Container {...props}>
            <g mask="url(#mask)">
                <use
                    style={`color: ${color};`}
                    overflow="visible"
                    xlinkHref="#feefo-widget-outside"
                />
            </g>
            <g clip-path="url(#clip)">
                <rect width={width} height="22" fill={color} />
            </g>
        </Container>
    );  
}

export default Stars;
