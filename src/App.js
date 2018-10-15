import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './Book'
import SearchContainer from './SearchContainer'
import { Link, Route } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: []
  }

  //get books from API & call function 'placeOnShelf' with the response data
  componentDidMount(){
    BooksAPI.getAll()
      .then(books => this.placeOnShelf(books))
  }

  addToShelf = (book, shelf) => {
    book.shelf = shelf
    this.setState(prevState => ({
      [shelf]: [...prevState[shelf], book]
    }))
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

  // use in render method below to display the books on the appropriate shelves
  renderBooks = (bookList) => {
    return (
      <div className="bookshelf-books">
        <ol className="books-grid">
          { bookList.map(book => {
            return  <li key={book.id}> <Book book={book}
                        changeState={this.changeState}/>
                    </li>})
          }
        </ol>
      </div>
    )
  }

  //update the local state so the change is reflected in the browser
  changeState = (book, newShelf) => {

    let previous = book.shelf
    let removeFromList = [...this.state[book.shelf]]
    if (newShelf === 'none'){
      removeFromList = removeFromList.filter(item => item.id !== book.id)
      this.setState({[previous]: removeFromList})
    } else {
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
        [previous]: removeFromList,
        [newShelf]: addToList
      })
    }
  }

  render() {
    return (
      <div className="app">

        <Route exact path="/" render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Currently Reading</h2>
                      {this.renderBooks(this.state.currentlyReading)}
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Want to Read</h2>
                      {this.renderBooks(this.state.wantToRead)}
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Read</h2>
                      {this.renderBooks(this.state.read)}
                  </div>
                </div>
              </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>

        <Route path="/search" render={() => (
          <SearchContainer addToShelf={this.addToShelf}/>
        )}/>

      </div>
    )
  }
}

export default BooksApp
