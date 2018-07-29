import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

export class UpdateKeywordsForm extends Component {
    constructor(props) {
		super(props);

		this.state = {
			link: decodeURIComponent(props.link),
			keywords: '',
			tags: []
		};
	}

	getValidationState() {
		const length = this.state.keywords.length;
		if (length > 10) return 'success';
		else if (length > 5) return 'warning';
		else if (length > 0) return 'error';
		return null;
	}

	updateKeywords(e){
		let keywords = e.target.value;
		this.setState({
			tags: keywords.split(','),
			keywords: keywords
		});
	}

	componentWillMount(){
		const links = this.props.links;
        links.forEach((link) => {
            if(link.url === decodeURIComponent(this.props.link)){
                this.setState({keywords: link.tags.join()})
            }
        });
	}


	submit(){
		const links = this.props.links;
        links.forEach((link, index, object) => {
            if(link.url === decodeURIComponent(this.props.link)){
                object[index].tags = this.state.tags
            }
        });
		this.props.updateLinks(links);
	}

    render() {
        return (
            <div className="configureBm">
                <div className="content">
				<form>
					<FormGroup
					controlId="formBasicText"
					validationState={this.getValidationState()}
					>
						<ControlLabel>Modifier les mots clés</ControlLabel>
						<FormControl
							type="text"
							value={this.state.keywords}
							placeholder="Enter keywords separated by comas"
							onChange={this.updateKeywords.bind(this)}
						/>
						<FormControl.Feedback />
					</FormGroup>
					<Link to="/"><Button onClick={this.submit.bind(this)}>Valider</Button></Link>
				</form>
                </div>
            </div>
        );
    }
}