import React, { Component } from 'react';
import { Panel, Glyphicon, Grid, Row, Col, ListGroup, ListGroupItem, Badge, Button, ButtonGroup, Pagination } from "react-bootstrap";
import { Link } from 'react-router-dom';


export class BookmarkList extends Component {
    constructor(props) {
        super(props);
        /**
         * Number of links by page which you can change if you want to display less or more links by page
         */
        this.linkByPage = 5;
        this.state = {
            links: props.links,
            lists: [],
            currentArray: [],
            items: [],
            linkToModify: null,
            activePage: 1
        }
    }

    /**
     * Delete the link
     * @param {String} url
     */
    removeLink(url) {
        const links = this.props.links;
        links.forEach((link, index, object) => {
            if(link.url === url){
                object.splice(index,1);
            }
        });
        this.props.updateLinks(links);
    }

    /**
     * Change current page when clicking on the pagination
     * @param {Number} i index of current page
     */
    changePage(i){
        const items = [];
        for (let number = 1; number <= this.state.lists.length; number++) {
            items.push(
                <Pagination.Item active={number === i} onClick={() => this.changePage(number)}>{number}</Pagination.Item>
            );
        }

        this.setState({
            currentArray: this.state.lists[i-1],
            items: items,
            activePage: i
        });
    }

    /**
     * Update the list
     */
    updateComponent(){
        const activePage = this.state.activePage,
            items = [],
            lists = [],
            links = this.props.links,
            listLength = this.props.links.length;
        let tmp = 0;

        for(let i = 0; i <= listLength; i++){
            if (i % this.linkByPage === 0 && listLength - i >= this.linkByPage) {
                lists.push(links.slice(tmp,tmp+this.linkByPage));
                tmp += this.linkByPage;
                if (i+this.linkByPage === listLength)  break;
            } else if (listLength < this.linkByPage) {
                lists.push(links.slice(tmp,listLength));
                break;
            } else if (i > this.linkByPage && listLength - i <= this.linkByPage) {
                lists.push(links.slice(tmp,listLength));
                break;
            }
        }

        for (let number = 1; number <= lists.length; number++) {
            items.push(
                <Pagination.Item active={number === activePage} onClick={() => this.changePage(number)}>{number}</Pagination.Item>
            );
        }

        this.setState({
            lists: lists,
            currentArray: typeof lists[activePage-1] === 'undefined' ? lists[0] : lists[activePage-1],
            items: items
        });
    }

    componentWillReceiveProps() {
        this.updateComponent();
    }

    componentDidMount(){
        this.updateComponent();
    }

    render() {
        return (
            <div>
                 <h2>Mes marque-pages</h2>
                    { this.state.currentArray.length > 0 ? this.state.currentArray.map(link =>
                        <Panel key={link.url}>
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
                                    <ListGroupItem>Titre: {link.title}</ListGroupItem>
                                    <ListGroupItem>Auteur: {link.author}</ListGroupItem>
                                    <ListGroupItem>Date d'ajout: {link.addedDate}</ListGroupItem>
                                    <ListGroupItem>Largeur: {link.width} px</ListGroupItem>
                                    <ListGroupItem>Hauteur: {link.height} px</ListGroupItem>
                                    {link.duration !== null ? <ListGroupItem>Duration: {link.duration} secs</ListGroupItem> : ''}
                                    {link.tags.length > 0
                                        ? <ListGroupItem>
                                            Mots clés: {link.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                                        </ListGroupItem>
                                        : ''
                                    }
                                </ListGroup>
                            </Panel.Body>
                        </Panel>
                        ) : <h4>Vous n'avez pas encore de marque-page.</h4>}
                        {this.state.items.length > 1 && this.state.linkToModify === null ? <div>
                            <Pagination bsSize="medium">{this.state.items}</Pagination>
                        </div> : ''}
            </div>
        );
    }
}