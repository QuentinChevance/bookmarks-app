import React, { Component } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from "react-bootstrap";
import { BookmarkForm } from "./components/bookmarksForm";
import { BookmarkList } from "./components/bookmarksList";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './App.css'
import { UpdateKeywordsForm } from './components/updateKeywords';

class App extends Component {
	constructor(props) {
		super(props);
		this.updateLinks = this.updateLinks.bind(this);
		this.toggleBmForm = this.toggleBmForm.bind(this);
		this.state = {
			links: [
				{
					url: "lologfdgfilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["loloilk","fd","dfds"]
				},
				{
					url: "lolojuyjyuilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["loloilk","fd","dfds"]
				},
				{
					url: "lolergeroilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["loloilk","fd","dfds"]
				},
				{
					url: "lolukuiouiooilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["loloilk","fd","dfds"]
				},
				{
					url: "lolj-ètoilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["loloilk","fd","dfds"]
				},
				{
					url: "lolodsqsdilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["loloilk","fd","dfds"]
				},
				{
					url: "lolojè_uju_ilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["loloilk","fd","dfds"]
				},
				{
					url: "lolosddcilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["loloilk","fd","dfds"]
				},
				{
					url: "loloih(-hlk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["io","oh","dfds"]
				},
				{
					url: "lolhfgjhoilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["hey","hey"]
				},
				{
					url: "lolwxdczeoilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["ok","cool","toi"]
				},
				{
					url: "loljujèuyj-oilk",
					title: "loloilk",
					author: "loloilk",
					addedDate: "loloilk",
					width: "loloilk",
					height: "loloilk",
					duration: null,
					tags: ["bonjour","ça","va"]
				}
			],
			bmListVisible: true,
			bmFormVisible: false
		};
	}

	toggleBmForm(){
		this.setState({
			bmFormVisible: !this.state.bmFormVisible,
			bmListVisible: !this.state.bmListVisible
		});
	}

	addLink(link){
		console.log("link",link);

		const links = this.state.links;
		links.unshift(link);
		this.setState({links:links});
		console.log("state changed",this.state);
	}

	updateLinks(links){
		this.setState({links:links});
	}

	MyBookmarkList = () => {
		return (
			<BookmarkList
				updateLinks = {this.updateLinks} links={this.state.links} toggleBmForm={this.toggleBmForm}
			/>
		);
	}

	MyBookmarkForm = () => {
		return (
			<BookmarkForm addLink={this.addLink.bind(this)} toggleBmForm={this.toggleBmForm}/>
		);
	}

	MyUpdateKeywordsForm = (props) => {
		console.log("MyUpdateKeywordsForm props",props.match.params.url);

		return (
			<UpdateKeywordsForm link={props.match.params.url} links={this.state.links} updateLinks = {this.updateLinks} />
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
										<Link to="/addBookmark"><Button>Ajouter un bookmark</Button></Link>
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
