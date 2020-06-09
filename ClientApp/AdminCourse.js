import React from "react";

class AdminCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: "CS1", password: "2345"};
    }
	
	setCourseClick() {
		let that = this;
		console.log("Button pressed");
		fetch('/setCourse', {
				method: 'POST',
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					name: that.state.name,
                    password: that.state.password,
                    enabled: true
				})
			}).then(function(response) {
				console.log('Request status code: ', response.statusText, response.status, response.type);
				return response.json();
			}).then(function(courseInfo) {
				that.props.setCourse(courseInfo.course);
				console.log(courseInfo);
			});
	}
	
	nameInput(event) {
		this.setState({name: event.target.value});
	}
	
    passInput(event) {
		this.setState({password: event.target.value});
	}
	
    // Renders component based on current state and props
    render() {
		return <main>
			<div className="LoginForm">
				<label>Name</label>
				<input type="text" value={this.state.name} onChange={this.nameInput.bind(this)}></input>
				<label>Course Password</label>
				<input type="text" value={this.state.password} onChange={this.passInput.bind(this)}></input>
				<button onClick={this.setCourseClick.bind(this)}>Set Course</button>
			</div>
		</main>
    }
}

export default AdminCourse;
