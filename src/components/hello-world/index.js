import { h, Component } from "preact";
import "./style.scss";

export default class App extends Component {
  render(props) {
    return (
      <div>
        <h1>{props.merchant_identifier}</h1>
      </div>
    );
  }
}
