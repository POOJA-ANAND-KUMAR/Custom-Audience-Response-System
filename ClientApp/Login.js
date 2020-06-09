import React from "react";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: "", password: ""};
    }
	
	loginClick() {
		let that = this;
		console.log("Button pressed");
		fetch('/login', {
				method: 'POST',
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					name: that.state.name,
					password: that.state.password
				})
			}).then(function(response) {
				console.log('Request status code: ', response.statusText, response.status, response.type);
				return response.json();
			}).then(function(userInfo) {
				that.props.setUser(userInfo);
				console.log(userInfo);
			});
	}
	
	nameInput(event) {
		this.setState({name: event.target.value});
	}
	
    passInput(event) {
		this.setState({password: event.target.value});
	}

	enterKey(event)
	{ 	const keyName = event.key;
	  if (keyName === 'Enter') {
		let that = this;
		console.log("Enter pressed");
		fetch('/login', {
				method: 'POST',
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					name: that.state.name,
					password: that.state.password
				})
			}).then(function(response) {
				console.log('Request status code: ', response.statusText, response.status, response.type);
				return response.json();
			}).then(function(userInfo) {
				that.props.setUser(userInfo);
				console.log(userInfo);
			});
	}
		  }	
    // Renders component based on current state and props
    render() {
		return <main>
			<div className="LoginForm">
				<label>Name:</label>
				<input type="text" value={this.state.name} onChange={this.nameInput.bind(this)} onKeyPress={this.enterKey.bind(this)}  ></input>
				<label>Password:</label>
				<input type="password" value={this.state.password} onChange={this.passInput.bind(this)} onKeyPress={this.enterKey.bind(this)} ></input>
				<button onClick={this.loginClick.bind(this)}>Login</button>
			</div>
		</main>
    }
}

export default Login;
