import React from 'react'
import './App.css'
import {Link, Route, Switch} from 'react-router-dom'
import Library from './Library'
import Search from './Search'
import * as BooksAPI from "./BooksAPI"
import _ from "lodash"
import update from "immutability-helper"
import NotificationSystem from "react-notification-system"
import PropTypes from 'prop-types';
import config from "./config"

class BooksApp extends React.Component {
    state = {
        books: []
    }


    getBooksFromServer = () => {
        console.log("Gettings books from server")
        BooksAPI.getAll().then(books => {
            this.addNotification({
                message: 'Books Loaded',
                level: 'success'
            });
            this.setState({
                books: books.map(book => _.pick(book, config.PICKED_PROPS))
            })
        })
    }

    componentDidMount = () => {
        console.log("Component Mounted.")
        this.getBooksFromServer()
    }


    getBookIndex = (book) => {

        return this.state.books.findIndex(function (c) {
            console.log(`${c.id} ==> ${book.id}`)
            return c.id === book.id;
        });
    }

    updateBook = (book, newShelf) => {
        const bookIndex = this.getBookIndex(book)
        if (bookIndex !== -1) {
            const updatedBook = update(this.state.books[bookIndex], {shelf: {$set: newShelf}});
            let newBooks = update(this.state.books, {
                $splice: [[bookIndex, 1, updatedBook]]
            });
            this.setState({books: newBooks});
        } else {
            this.addNotification({
                message: 'Book not found in state',
                level: 'error'
            })
        }
    }

    addBook = (book, shelf) => {
        book.shelf = shelf
        let newArray = this.state.books.slice();
        newArray.push(book);
        this.setState({
            books: newArray
        })
    }


    removeBook = (book) => {
        const bookIndex = this.getBookIndex(book)

        if (bookIndex !== -1) {
            this.setState({
                books: update(this.state.books, {$splice: [[bookIndex, 1]]})
            })
            this.addNotification({
                    message: 'Book removed from your shelf',
                    level: 'success'
                })
        } else {
            this.addNotification({
                message: 'Book not found.',
                level: 'error'
            })
        }
    }

    static childContextTypes = {
        addNotification: PropTypes.func,
    };

    getChildContext() {
        return {
            addNotification: this.addNotification.bind(this),
        };
    }

    addNotification(notification) {
        this.notifications.addNotification(notification);
    }


    changeShelf = (e, book) => {
        let newShelf = e.target.value;
        let self = this;
        if (newShelf === "none") {
            this.removeBook(book)

        } else {
            const bookIndex = this.getBookIndex(book)
            if (bookIndex === -1) {
                this.addBook(book, newShelf)
                this.addNotification({
                    message: 'Book Added to your shelf',
                    level: 'success'
                })
            } else {
                this.updateBook(book, newShelf)
            }

        }

        //Notify server of change
        BooksAPI.update(book, newShelf)
            .catch(function (error) {
                self.addNotification({
                    message: `Error while updating book on server. Server message: ${error.message}`,
                    level: 'error'
                })
            })
    }


    render() {
        const {books} = this.state
        return (
            <div className="app">
                <NotificationSystem ref={ref => this.notifications = ref}/>
                <Switch>
                    <Route exact path="/" render={() =>
                        (<div>
                            <Library books={books} onShelfChange={this.changeShelf}/>
                            <div className="open-search">
                                <Link to="/search">Add a book</Link>
                            </div>
                        </div>)
                    }/>
                    <Route path="/search" render={() =>
                        (<div><Search books={books} onAdd={this.changeShelf}/></div>)
                    }/>
                    <Route render={() => (
                        <div>404 not found</div>
                    )}/>

                </Switch>
            </div>
        )
    }
}

export default BooksApp
