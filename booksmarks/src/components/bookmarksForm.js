import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock, Button } from "react-bootstrap";
import axios from "axios";
import Link from 'react-router-dom/Link';

export class BookmarkForm extends Component {
    constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.state = {
			keywords: '',
			url: '',
			tags: []
		};
	}

	getValidationState() {
		const length = this.state.url.length;
		if (length > 10) return 'success';
		else if (length > 5) return 'warning';
		else if (length > 0) return 'error';
		return null;
	}

	handleChange(e) {
		this.setState({url:e.target.value});
	}

	updateKeywords(e){
		let keywords = e.target.value;
		this.setState({
			tags: keywords.split(','),
			keywords: keywords
		});
	}

	getMeta(url,response){
        const self = this,
            img = new Image();
        img.addEventListener("load", function(){
            let tmpLink = {
                url: self.state.url,
                title: response.data.photo.title._content,
                author: response.data.photo.owner.username,
                addedDate: new Date(response.data.photo.dates.posted*1000).toString(),
                width: this.naturalWidth,
                height: this.naturalHeight,
                duration: null,
                tags: self.state.tags
            };
			self.props.addLink(tmpLink);
			console.log("link added",tmpLink);
			self.setState({
				url: '',
				tags: [],
				keywords: ''
			});
        });
        img.src = url;
    }

	submit(){
		const self = this;
        if(this.state.url.includes('vimeo')){
			console.log("link",this.state.url);
			axios.get("https://api.vimeo.com/videos/"+this.state.url.substr(this.state.url.lastIndexOf('/') + 1),{
				headers: {'Authorization': "bearer 2f121aa92937fb84d529284184fce177"}
			})
			.then(function (response) {
				console.log(response);
				let tmpLink = {
					url: response.data.link,
					title: response.data.name,
					author: response.data.user.name,
					addedDate: response.data.created_time,
					width: response.data.width,
					height: response.data.height,
					duration: response.data.duration,
					tags: self.state.tags
				};
				self.props.addLink(tmpLink);

				self.setState({
					url: '',
					tags: [],
					keywords: ''
				});
			})
			.catch(function (error) {
				console.log(error);
			});
		} else if (this.state.url.includes('flickr')) {
			console.log(`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=796a3cd3977fcab809adf5489af980a1&photo_id=${this.state.url.substr(this.state.url.lastIndexOf('/') + 1)}&format=json&nojsoncallback=1`);

			axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=796a3cd3977fcab809adf5489af980a1&photo_id=${this.state.url.substr(this.state.url.lastIndexOf('/') + 1)}&format=json&nojsoncallback=1`)
				.then(function (response) {
					console.log(response);
					self.getMeta(`https://farm${response.data.photo.farm}.staticflickr.com/${response.data.photo.server}/${response.data.photo.id}_${response.data.photo.secret}.jpg`,response);
				})
				.catch(function (error) {
					console.log(error);
				});
		}
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
						<ControlLabel>Working example with validation</ControlLabel>
						<FormControl
							type="url"
							value={this.state.url}
							placeholder="Enter flick or vimeo url"
							onChange={this.handleChange}
						/>
						<FormControl.Feedback />
						<HelpBlock>Validation is based on string length.</HelpBlock>
						<ControlLabel>Ajout mots clés</ControlLabel>
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