import React from "react"
import {Link} from "react-router-dom"
import * as BooksAPI from "./BooksAPI"
import {Bookshelf} from "./Library"
import _ from "lodash"
import PropTypes from 'prop-types';
import config from "./config"


class Search extends React.Component {

    static contextTypes = {
        addNotification: PropTypes.func.isRequired,
    };

    state = {
        query: '',
        result: []
    }

    findBookById = (id, books) => {
        return _.find(books, function (o) {
            return o.id === id;
        });
    }

    updateState = ( (result, myBooks = this.props.books) => {
        console.log("Updating state of search results.")
        let books = result.map(r => _.pick(r, config.PICKED_PROPS))
        let self = this
        if (!books.error) {
            _.each(books, book => {
                let inMyBooks = self.findBookById(book.id, myBooks)
                if (inMyBooks) {
                    book.shelf = inMyBooks.shelf
                } else {
                    book.shelf = "none"
                }
            })

            this.setState({
                result: books
            })
        }
        else {
            this.setState({
                result: []
            })
        }
    })


    searchBooks = e => {
        console.log("Searching for books")
        const q = e.target.value
        this.setState({
            query: q
        })

        BooksAPI.search(q).then(result => {
            this.updateState(result)
        })
    }


    logBooks(books) {
        console.log(books)
        if (books) {
            console.log("===Logging books===")
            books.forEach(book => {
                console.log(book.id + " - " + book.title + " - " + book.shelf)
            })
            console.log("======")
        }
    }

    componentWillReceiveProps(newProps) {
        console.log("componentWillReceiveProps")
        this.logBooks(newProps.books)
        this.logBooks(this.props.books)
        if (newProps.books !== this.props.books) {
            this.updateState(this.state.result, newProps.books)
        }
    }

    render() {
        console.log("Rendering search")
        const {query, result} = this.state
        const {onAdd} = this.props
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text" value={query} onChange={this.searchBooks}
                               placeholder="Search by title or author"/>
                    </div>
                </div>
                {result && result.length > 0 &&
                (
                    <div className="search-books-results">
                        <Bookshelf books={result} shelfName="Search Results" onShelfChange={onAdd}/>
                    </div>)
                }


            </div>
        )
    }


}


export default Search