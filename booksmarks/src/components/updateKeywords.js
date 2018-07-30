import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Glyphicon } from "react-bootstrap";
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
					>
						<ControlLabel>Modifier les mots clés</ControlLabel>
						<FormControl
							type="text"
							value={this.state.keywords}
							placeholder="Les mots-clés doivent être séparés par des virgules (ex: mot1,mot2,...)"
							onChange={this.updateKeywords.bind(this)}
						/>
						<FormControl.Feedback />
					</FormGroup>
					<Link to="/"><Button onClick={this.submit.bind(this)}>Valider <Glyphicon glyph="ok" /></Button></Link>
				</form>
                </div>
            </div>
        );
    }
}