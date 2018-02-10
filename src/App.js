import React, { Component } from 'react'
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

const defaultDataUrl = 'https://gist.githubusercontent.com/insekkei/dcb137b97d58131dde016bc4edebcfb0/raw/87d01ee1be238e014101bd73e4c804e10647a369/data.json'

class App extends Component {
  constructor () {
    super()

    const localDataUrl = localStorage.getItem('dataUrl')
    this.state = {
      dataUrl: localDataUrl || defaultDataUrl,
      remoteFile: {data: []},
      showUrlInfo: false
    }
  }
  componentDidMount () {
    this.fetchDataUrl()
  }
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

  onDataUrlChange = (e) => {
    this.setState({
      dataUrl: e.target.value
    })
  }

  fetchDataUrl = () => {
    const {dataUrl} = this.state
    localStorage.setItem('dataUrl', dataUrl)
    fetch(dataUrl).then((res) => {
      Promise.resolve(res.json()).then(result => {
        this.setState({
          remoteFile: result,
          message: '',
          showUrlInfo: false
        })
      }).catch(e => {
        this.setState({
          message: '文件格式解析错误'
        })
      })
    }).catch(e => {
      this.setState({
        message: 'url 请求不过来'
      })
    })
  }

  render() {
    const {remoteFile: {data}, showUrlInfo, message} = this.state
    return (
      <div className="App CategoryList">

        <div className={`DataUrlInfo ${showUrlInfo ? 'show' : 'hide'}`}>
          <input type='text' value={this.state.dataUrl} onChange={this.onDataUrlChange} />
          <input type='button' value='UPDATE' onClick={this.fetchDataUrl} />
          {
            message && (
              <span className='Message'>{message}</span>
            )
          }
          <span className='Close' onClick={() => { this.setState({showUrlInfo: false}) }}>&times;</span>
        </div>
        <div className='UpdateUrl' onClick={() => { this.setState({showUrlInfo: true}) }}>
          SETTINGS
        </div>

        {
          message && !showUrlInfo && (
            <div className='Message Bar'>{message}</div>
          )
        }

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
