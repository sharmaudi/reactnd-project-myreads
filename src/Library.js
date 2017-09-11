import React from "react"
import _ from 'lodash'

const Library = ({books, onShelfChange}) => {

    const groupedBooks = _.groupBy(books, 'shelf')

    return (
        <div className="list-books-content">
            <Bookshelf
                shelfName="Read"
                books={groupedBooks.read}
                onShelfChange={onShelfChange}
            />

            <Bookshelf
                shelfName="Reading"
                books={groupedBooks.currentlyReading}
                onShelfChange={onShelfChange}
            />
            <Bookshelf
                shelfName="Want to Read"
                books={groupedBooks.wantToRead}
                onShelfChange={onShelfChange}
            />

        </div>
    )
}

const Bookshelf = ({shelfName, books, onShelfChange}) => {
    console.log("Rendering books for shelf " + shelfName)
    console.log(books)
    const shownBooks = _.sortBy(books, 'title');

    if (books) {
        return (
            <div className="bookshelf">
                {shelfName && shelfName.length > 0 && (
                    <h2 className="bookshelf-title">{shelfName}</h2>
                )}
                <div className="bookshelf-books">
                    <ol className="books-grid">
                        {shownBooks.map(book => (
                            <li key={book.id}>
                                <Book key={book.id} book={book} onShelfChange={onShelfChange}/>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
    else {
        return null;
    }
}

const Book = ({book, onShelfChange}) => {

    const author = book.authors ? book.authors[0] : ''

    const style = {
        backgroundImage: book.imageLinks ? 'url(' + book.imageLinks.thumbnail + ')' : '',
        width: 128,
        height: 193
    }

    const shelf = book.shelf ? book.shelf : "none"

    return (
        <div className="book">
            <div className="book-top">
                <div className="book-cover" style={style}/>
                <div className="book-shelf-changer">
                    <select value={shelf}
                            onChange={(e) => {
                                if (onShelfChange) {
                                    onShelfChange(e, book)
                                }
                            }}>
                        <option value="novalue" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                    </select>
                </div>
            </div>
            <div className="book-title">{book.id}</div>
            <div className="book-title">{book.title}</div>
            <div className="book-authors">{author}</div>
        </div>
    )
}

export default Library
export {Bookshelf, Book}