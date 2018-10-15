import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import Book from './Book'
import { Link } from 'react-router-dom'


class SearchContainer extends Component {
  state = {
    results: [],
    query: ''
  }

  handleSearch = (e) => {
    const query = e.target.value
    this.setState({query},
      () => BooksAPI.search(this.state.query)
        .then(res => {
          if(!res || res.error) {
            this.setState({results: []})
          }
          else {
            this.setState({results: res}, this.displayCorrectStatus)
          }
        })
    )
  }

  // search results should display correct status if book is already on shelf
  displayCorrectStatus = () => {
    let onShelf = this.props.onShelf
    let booksArray = [...onShelf.currentlyReading, ...onShelf.wantToRead, ...onShelf.read]
    let booksOnShelf = {}
    booksArray.forEach(book => {
      if (!booksOnShelf[book.id]){
        booksOnShelf[book.id] = book
      }
    })

    let updatedResults = this.state.results.map(item => {
      if (booksOnShelf[item.id]){
        return booksOnShelf[item.id]
      }
      return item
    })

    this.setState({results: updatedResults})
  }

  render(){
    const { results } = this.state
  
    return  <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search" >Close</Link>
                <div className="search-books-input-wrapper">
                  <input type="text" placeholder="Search by title or author"
                        value={this.state.query} onChange={this.handleSearch}/>
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                    {results.length > 0 && results.map(book => {
                      return(
                        <li key={book.id}>
                          <Book book={book} addToShelf={this.props.addToShelf}
                          changeState={this.props.changeState}/>
                        </li>
                    )})}
                </ol>
              </div>
         </div>
  }
}

export default SearchContainer
