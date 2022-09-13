import React from "react";
import otplib from "otplib/otplib-browser";
import QRCode from "qrcode";
import getFormData from "get-form-data";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.secret = "KFCTML3YPBRTS3DMKRIWSUDRNREUUNJU";
    this.token = otplib.authenticator.generate(this.secret);

    this.state = {
      isValid: false
    };
  }

  componentDidMount() {
    const otpauth = otplib.authenticator.keyuri("test", "otp", this.secret);

    QRCode.toCanvas(this.canvas, otpauth, function(error) {
      if (error) {
        console.error(error);
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const formData = getFormData(form);

    form.reset();

    console.log("submit", formData);

    this.setState(
      {
        isValid: otplib.authenticator.verify({
          secret: this.secret,
          token: formData.token
        })
      },
      () => {
        this.result.classList.add("animated", "flash");
        this.result.addEventListener("animationend", this.cleanAnimation);
      }
    );
  };

  cleanAnimation = () => {
    this.result.classList.remove("animated", "flash");
  };

  render() {
    const isValid = this.state.isValid.toString();

    return (
      <div className="container">
        <h1>2FA</h1>
        <div className="qrcode">
          <canvas ref={c => (this.canvas = c)} />
        </div>

        <form className="token-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              ref={c => (this.input = c)}
              name="token"
              type="tel"
              className="form-control"
              placeholder="Insert your token"
              pattern="[0-9]{6}"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block">
              VERIFY
            </button>
          </div>
        </form>
        <div ref={c => (this.result = c)} className={`token-result ${isValid}`}>
          {this.state.isValid.toString()}
        </div>
      </div>
    );
  }
}
