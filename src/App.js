import React, { Component } from 'react'
import {data} from './data'
import './App.css'

const colors = {
  0: '105, 215, 86',
  1: '255, 181, 22',
  2: '255, 122, 21',
  3: '146, 119, 232',
  4: '34, 212, 195',
  5: '255, 89, 73',
  6: '85, 186, 230'
}

class App extends Component {
  getBackColor = (str) => {
    let hash = 0
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }

    const colorIndex = hash % 7
    return `rgb(${colors[colorIndex]})`
  }

  render() {
    return (
      <div className="App CategoryList">
        {
          data.map((catItem, catIndex) => (
            <div key={catIndex} className='CategoryItem'>
              <div className='CategoryName'>{catItem.categoryName}</div>
              <div className='BookMarksList'>
                {
                  catItem.bookMarks.map((bookMarksItem, bookMarksIndex) => {
                    const background = this.getBackColor(bookMarksItem.name)
                    return (
                      <a href={bookMarksItem.url} target='_target' key={bookMarksIndex} className='BookMarksItem'>
                        <div className='BookMarksIcon' style={{
                          background
                        }}>{bookMarksItem.name.slice(0, 1)}</div>
                        <div className='BookMarksText'>{bookMarksItem.name}</div>
                      </a>
                    )
                  })
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

export default App
