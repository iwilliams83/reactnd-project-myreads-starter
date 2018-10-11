import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './Book.js'

class BooksApp extends React.Component {
  state = {
    /*
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    currentlyReading: [],
    wantToRead: [],
    read: [],
    showSearchPage: false
  }

  //get books from API & call function 'placeOnShelf' with the response data
  componentDidMount(){
    BooksAPI.getAll()
      .then(books => this.placeOnShelf(books))
  }

  //set initial state (place the books on their respective shelves)
  placeOnShelf = (books) => {
    let currentBooks = []
    let desiredBooks = []
    let alreadyRead = []

    books.forEach(book => {
      if (book.shelf === 'currentlyReading'){
        currentBooks.push(book)
      }
      else if (book.shelf === 'wantToRead'){
        desiredBooks.push(book)
      }
      else if (book.shelf === 'read'){
        alreadyRead.push(book)
      }
      else {
        desiredBooks.push(book)
      }
    })

    this.setState({
      currentlyReading: currentBooks, wantToRead: desiredBooks, read: alreadyRead
    })
  }

  //update the API when a user wants to move a book to a new shelf
  updateAPI = (book, shelf) => {
    BooksAPI.update(book, shelf)
  }

  //update the local state so the change is reflected in the browser
  changeState = (book, newShelf) => {
    let previous = book.shelf
    let removeFromList = [...this.state[book.shelf]]
    let addToList = [...this.state[newShelf]]

    addToList.push(book)

    addToList = addToList.map(item => {
      if(item.id === book.id){
        item.shelf = newShelf
        return item
      }
      return item
    })

    removeFromList = removeFromList.filter(item => item.id !== book.id)

    this.setState({
      [previous]: removeFromList, [newShelf]: addToList
    })
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.currentlyReading.map(book => {
                        return  <li key={book.id}>
                                  <Book book={book}
                                    changeState={this.changeState}
                                    updateAPI={this.updateAPI}/>
                                </li>
                        })}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                        {this.state.wantToRead.map(book => {
                          return  <li key={book.id}>
                                    <Book book={book}
                                    changeState={this.changeState}
                                    updateAPI={this.updateAPI}/>
                                  </li>
                          })}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.read.map(book => {
                        return  <li key={book.id}>
                                  <Book book={book}
                                  changeState={this.changeState}
                                  updateAPI={this.updateAPI}/>
                                </li>
                        })}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
