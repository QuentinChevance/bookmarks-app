import React, { Component } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from "react-bootstrap";
import { BookmarkForm } from "./components/bookmarksForm";
import { BookmarkList } from "./components/bookmarksList";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { UpdateKeywordsForm } from './components/updateKeywords';

class App extends Component {
	constructor(props) {
		super(props);
		this.updateLinks = this.updateLinks.bind(this);
		this.state = {
			links: JSON.parse(localStorage.getItem('links')).length > 0 ? JSON.parse(localStorage.getItem('links')) : []
		};
	}

	/**
	 * Add a link to this.state.links
	 * @param {Object} link
	 */
	addLink(link){
		const links = this.state.links;
		links.unshift(link);
		localStorage.setItem('links', JSON.stringify(links));
		this.setState({links:links});
	}

	/**
	 * Update all the links
	 * @param {Array} links
	 */
	updateLinks(links){
		localStorage.setItem('links', JSON.stringify(links));
		this.setState({links:links});
	}

	/**
	 * BookmarkList component
	 */
	MyBookmarkList = () => {
		return (
			<BookmarkList
				updateLinks = {this.updateLinks} links={this.state.links} toggleBmForm={this.toggleBmForm}
			/>
		);
	}

	/**
	 * BookmarkForm component
	 */
	MyBookmarkForm = () => {
		return (
			<BookmarkForm addLink={this.addLink.bind(this)} toggleBmForm={this.toggleBmForm} links={this.state.links}/>
		);
	}

	/**
	 * UpdateKeywordsForm component
	 */
	MyUpdateKeywordsForm = (props) => {
		return (
			<UpdateKeywordsForm link={props.match.params.url} links={this.state.links} updateLinks = {this.updateLinks}/>
		);
    }

	render() {
		return (
			<Router>
				<div className="App">
				<header className="container jumbotron">
					<h1>Bookmarks</h1>
				</header>
					<div className="container">
						<Grid>
							<Row className="show-grid">
								<Col md={8}></Col>
								<Col md={2}>
										<Link to="/addBookmark"><Button>Ajouter un marque-page</Button></Link>
								</Col>
								<Col md={2}><Link to="/"><Button><Glyphicon glyph="home" /></Button></Link></Col>
							</Row>
						</Grid>
						<Switch>
							<Route exact path='/' component={this.MyBookmarkList}/>
							<Route path='/addBookmark' component={this.MyBookmarkForm}/>
							<Route path='/modifyBookmark/:url' component={this.MyUpdateKeywordsForm}/>
						</Switch>
					</div>

				</div>
			</Router>
		);
	}
}

export default App;
