import React, { Component } from 'react'
//import * as BooksAPI from './BooksAPI'

export default class Book extends Component {

  //handle shelf selection from the dropdown:
  handleChange = (e) => {
    //callbacks are passed down to components as props:
    this.props.changeState(this.props.book, e.target.value)
    this.props.updateAPI(this.props.book, e.target.value)
  }

  render(){
    let book = this.props.book

    let style = { width: 128, height: 193,
      backgroundImage: `url(${book.imageLinks.thumbnail}&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y)`
    }

    return (
      <div className="book">
        <div className="book-top">
        <div className="book-cover" style={style}></div>
          <div className="book-shelf-changer">
            <select onChange={this.handleChange} value={book.shelf}>
              <option value="move" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">{book.authors[0]}</div>
      </div>
          )
  }
}
