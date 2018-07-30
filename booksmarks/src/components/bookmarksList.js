import React, { Component } from 'react';
import { Panel, Glyphicon, Grid, Row, Col, ListGroup, ListGroupItem, Badge, Button, ButtonGroup, Pagination } from "react-bootstrap";
import { Link } from 'react-router-dom';


export class BookmarkList extends Component {
    constructor(props) {
        super(props);
        this.modifyLinkKw = this.modifyLinkKw.bind(this);
        this.state = {
            links: props.links,
            lists: [],
            currentArray: [],
            items: [],
            linkToModify: null
        }
    }


    removeLink(url) {
        console.log("url",url);

        const links = this.props.links;
        links.forEach((link, index, object) => {
            if(link.url === url){
                object.splice(index,1);
            }
        });
        this.props.updateLinks(links);
        // this.props.toggleBmForm();
        // this.props.toggleBmForm();

    }

    changePage(i){

        let items = [];

        for (let number = 1; number <= this.state.lists.length; number++) {
            console.log("number",number,"length",this.state.lists.length)
            items.push(
                <Pagination.Item active={number === i} onClick={() => this.changePage(number)}>{number}</Pagination.Item>
            );
        }

        this.setState({
            currentArray: this.state.lists[i-1],
            items: items
        });
    }

    updateComponent(){
        console.log("props",this.props);

        let tmp = 0,
            lists = [],
            links = this.props.links,
            listLength = this.props.links.length;
        console.log("this.props.links",this.props);

        for(let i = 0; i <= listLength; i++){
            if (i % 5 === 0 && listLength - i >= 5) {
                console.log("not last push, i",i,"listLength",listLength);
                lists.push(links.slice(tmp,tmp+5));
                tmp += 5;
                if (i+5 === listLength) {
                    break;
                }
                console.log("links",links);
            } else if (listLength < 5) {
                lists.push(links.slice(tmp,listLength));
                break;
            } else if (i > 5 && listLength - i <= 5) {
                lists.push(links.slice(tmp,listLength));
                console.log("last push, i",i,"listLength",listLength);

                break;
            }
        }
        let items = [],
            activePage = 1;
        console.log("this.state.activePage",this.state.activePage);

        for (let number = 1; number <= lists.length; number++) {
            console.log("number",number,"length",this.state.lists.length)
            items.push(
                <Pagination.Item active={number === activePage} onClick={() => this.changePage(number)}>{number}</Pagination.Item>
            );
        }

        this.setState({
            lists: lists,
            currentArray: lists[0],
            items: items
        });
    }

    componentWillReceiveProps() {
        console.log("PROPS RECEIVED");
        this.updateComponent();
    }

    componentDidMount(){
        console.log("WILL MOOOOOOUNT");
        this.updateComponent();
    }


    modifyLinkKw(url = null) {
        this.setState({linkToModify:url});
    }

    render() {
        return (
            <div>
                 <h2>Mes bookmarks</h2>
                    {console.log("this.state.currentArray",this.state.currentArray)}
                    { typeof this.state.currentArray !== "undefined" ? this.state.currentArray.map(link =>
                        <Panel>
                            <Panel.Heading>
                                <Grid>
                                    <Row className="show-grid">
                                        <Col md={10}><Panel.Title><a href={link.url} target="_blank">{link.url}</a></Panel.Title></Col>
                                        <Col md={2}>
                                            <ButtonGroup>
                                                <Link to={"/modifyBookmark/"+encodeURIComponent(link.url)}><Button><Glyphicon glyph="edit" /></Button></Link>
                                                <Button onClick={() => this.removeLink(link.url)}><Glyphicon glyph="trash" /></Button>
                                            </ButtonGroup>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Panel.Heading>
                            <Panel.Body>
                                <ListGroup>
                                    <ListGroupItem>Title: {link.title}</ListGroupItem>
                                    <ListGroupItem>Author: {link.author}</ListGroupItem>
                                    <ListGroupItem>Added date: {link.addedDate}</ListGroupItem>
                                    <ListGroupItem>Width: {link.width}</ListGroupItem>
                                    <ListGroupItem>Height: {link.height}</ListGroupItem>
                                    {link.duration !== null ? <ListGroupItem>Duration: {link.duration}</ListGroupItem> : ''}
                                    <ListGroupItem>
                                        Mots clés: {link.tags.map(tag => <Badge>{tag}</Badge>)}
                                    </ListGroupItem>
                                </ListGroup>
                            </Panel.Body>
                        </Panel>
                        ) : ''}
                        {this.state.items.length > 1 && this.state.linkToModify === null ? <div>
                            <Pagination bsSize="medium">{this.state.items}</Pagination>
                        </div> : ''}
            </div>
        );
    }
}