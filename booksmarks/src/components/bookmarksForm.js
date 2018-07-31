import React, { Component } from 'react';
import { Alert, FormGroup, FormControl, ControlLabel, HelpBlock, Button, Glyphicon } from "react-bootstrap";
import axios from "axios";
import Link from 'react-router-dom/Link';

export class BookmarkForm extends Component {
    constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.state = {
			keywords: '',
			url: '',
			tags: [],
			alert: {
				content: '',
				type: ''
			}
		};
	}

	/**
	 * Notifies the user if the url is not in a valid format
	 */
	getValidationState() {
		if (this.state.url.length === 0) {
			return 'info';
		} else if(this.state.url.match(/(https:\/\/www\.flickr\.com\/photos\/.*\/\d+(\/$){0,1})|(https:\/\/vimeo\.com\/.*\d+(\/$){0,1})/)){
			let ret = 'success';
			this.props.links.forEach(link => {
				if(link.url === this.state.url){
					ret = 'warning';
				}
			})
			return ret;
		} else {
			return 'error';
		}
	}

	/**
	 * Change url state
	 * @param {Event} e
	 */
	handleChange(e) {
		this.setState({url:e.target.value});
	}

	/**
	 * Update keywords and tags state
	 * @param {Event} e
	 */
	updateKeywords(e){
		let keywords = e.target.value;
		this.setState({
			tags: keywords.split(','),
			keywords: keywords
		});
	}

	/**
	 * Get dimensions of the picture
	 * @param {String} url
	 * @param {Object} response
	 */
	getMeta(url,response){
        const self = this,
            img = new Image();
        img.addEventListener("load", function(){
            let tmpLink = {
                url: self.state.url,
                title: response.data.photo.title._content,
				author: response.data.photo.owner.username,
				addedDate: new Date(response.data.photo.dates.posted * 1000).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                width: this.naturalWidth,
                height: this.naturalHeight,
                duration: null,
                tags: self.state.tags
            };
			self.props.addLink(tmpLink);
        });
        img.src = url;
	}

	/**
	 * Change the alert state
	 * @param {String} content
	 * @param {String} type
	 */
	handleAlert(content = '',type = ''){
		this.setState({
			alert: {
				content: content,
				type: type
			}
		});
	}

	/**
	 * Submit a new link
	 * @param {Event} e
	 */
	submit(e){
		const self = this,
			linkUrl = this.state.url.endsWith("/") ? this.state.url.substring(0, this.state.url.length-1) : this.state.url;
		// Check if the url is valid, otherwise display an alert
		if(this.getValidationState() === 'success') {
			// Check if the url is from vimeo
			if(linkUrl.includes('vimeo')){
				axios.get("https://api.vimeo.com/videos/"+linkUrl.substr(linkUrl.lastIndexOf('/') + 1),{
					headers: {'Authorization': "bearer 2f121aa92937fb84d529284184fce177"}
				})
				.then(function (response) {
					let tmpLink = {
						url: response.data.link,
						title: response.data.name,
						author: response.data.user.name,
						addedDate: new Date(response.data.created_time).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
						width: response.data.width,
						height: response.data.height,
						duration: response.data.duration,
						tags: self.state.tags
					};
					self.props.addLink(tmpLink);
				})
				.catch(function (error) {
					console.log(error);
				});
			// Check if the url is from flickr
			} else if (linkUrl.includes('flickr')) {
				axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=796a3cd3977fcab809adf5489af980a1&photo_id=${linkUrl.substr(linkUrl.lastIndexOf('/') + 1)}&format=json&nojsoncallback=1`)
					.then(function (response) {
						self.getMeta(`https://farm${response.data.photo.farm}.staticflickr.com/${response.data.photo.server}/${response.data.photo.id}_${response.data.photo.secret}.jpg`,response);
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		} else if(this.getValidationState() === 'info'){
			this.handleAlert("Veuillez coller votre url","info");
			e.preventDefault();
		} else if(this.getValidationState() === 'warning'){
			this.handleAlert("Ce lien est déjà présent dans la liste","warning");
			e.preventDefault();
		} else {
			this.handleAlert("Votre url n'est pas du bon type","danger");
			e.preventDefault();
		}
	}

    render() {
        return (
            <div className="configureBm">
                <div className="content">
				{this.state.alert.content !== ''
					? <Alert bsStyle={this.state.alert.type} onDismiss={() => this.handleAlert()}>
						<h4>Votre lien est mal renseigné (╯°□°）╯︵ ┻━┻</h4>
						<p>
							{this.state.alert.content}.
						</p>
						<p>
							<Button onClick={() => this.handleAlert()}>OK</Button>
						</p>
						</Alert>
				:''}

				<form>
					<FormGroup
					controlId="formBasicText"
					validationState={this.getValidationState() === 'info' ? 'warning' : this.getValidationState()}
					>
						<ControlLabel>Votre lien doit être du type {'https://www.flickr.com/photos/{auteurId}/{photoId} ou https://vimeo.com/{videoId}'}</ControlLabel>
						<FormControl
							type="url"
							value={this.state.url}
							placeholder="Entrer une url provenant de flickr.com ou vimeo.com"
							onChange={this.handleChange}
						/>
						<FormControl.Feedback />
							<HelpBlock>La validation est basée sur le format de votre url.</HelpBlock>
						<FormControl.Feedback />
					</FormGroup>
					<ControlLabel>Ajout mots clés</ControlLabel>
						<FormControl
							type="text"
							value={this.state.keywords}
							placeholder="Les mots-clés doivent être séparés par des virgules (ex: mot1,mot2,...)"
							onChange={this.updateKeywords.bind(this)}
						/>
					<Link to="/"><Button onClick={this.submit.bind(this)}>Valider <Glyphicon glyph="ok" /></Button></Link>
				</form>
                </div>
            </div>
        );
    }
}