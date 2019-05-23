const Button = ({icon, ...props, children}) => {

    return (
        <button {...props}>
           <img src={icon} />
        </button>
    );  
}

export default Button;
