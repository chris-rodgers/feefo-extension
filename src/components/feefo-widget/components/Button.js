const Button = ({Icon, ...props}) => {

    return (
        <button {...props}>
            <Icon/>        
        </button>
    );  
}

export default Button;
