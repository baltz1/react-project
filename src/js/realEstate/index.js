import React, { Component} from 'react'
import ReactDOM from 'react-dom'
import Header from './Header.js'
import Filter from './Filter.js'
import Listings from './Listings.js'
import listingData from './data/listingData.js'

class App extends Component {
  constructor () {
    super()
    this.state = {
      listingData,
      city: 'All',
      homeType: 'All',
      rooms: '0',
      min_price: 0,
      max_price: 10000000,
      min_floor_space: 0,
      max_floor_space: 50000,
      Elevators: false,
      Swimming_pool: false,
      finished_basement: false,
      gym: false,
      filteredData: listingData,
      populateFormsData: '',
      sortby: 'price-asc',
      view: 'box',
      search: ''
    }

    this.change = this.change.bind(this)
    this.filteredData = this.filteredData.bind(this)
    this.populateForms = this.populateForms.bind(this)
    this.changeView = this.changeView.bind(this)
  }

  componentWillMount() {

    var listingData = this.state.listingData.sort((a,b)=>{
        return a.price - b.price
    })

    this.setState({
      listingData
    })
  }
  change(event) {
    var name = event.target.name
    var value = (event.target.type === 'checkbox') ?event.target.checked : event.target.value
    this.setState({
      [name]: value
    }, () => {
      console.log(this.state);
      this.filteredData()
    })
  }

  changeView(viewName) {
    this.setState({
      view: viewName
    })
  }

  filteredData() {
    var newData = this.state.listingData.filter((item) => {
      return item.price >= this.state.min_price && item.price <= this.state.max_price && item.floorspace >= this.state.min_floor_space && item.floorspace <= this.state.max_floor_space && item.rooms >=this.state.rooms
    })
    if(this.state.city != "All") {
      newData = newData.filter((item) => {
        return item.city == this.state.city
      })
    }
    if(this.state.homeType != "All") {
      newData = newData.filter((item) => {
        return item.homeType == this.state.homeType
      })
    }
    // price filter
    if(this.state.sortby == 'price-dsc'){
      newData = newData.sort((a,b) =>{
        return a.price - b.price
      })
    }
    if(this.state.sortby == 'price-asc'){
      newData = newData.sort((a,b) =>{
        return b.price - a.price
      })
    }
    // Search Filter
    if(this.state.search != ""){
      newData = newData.filter((item) =>{
        var city = item.city.toLowerCase()
        var searchText = this.state.search.toLowerCase()
        var n = city.match(searchText)

        if(n != null){
          return true
        }
      })
    }
    // Extras filter
    if(this.state.Elevators == true){
       newData = newData.filter((item) =>{
         if(item.extras.indexOf('elevator') >=0){
          return item
         }
      })
      console.log(newData);
    }

    if(this.state.Swimming_pool == true){
       newData = newData.filter((item) =>{
         if(item.extras.indexOf('Swimming_pool') >=0){
          return item
         }
      })
      console.log(newData);
    }

    if(this.state.finished_basement == true){
       newData = newData.filter((item) =>{
         if(item.extras.indexOf('finished_basement') >=0){
          return item
         }
      })
      console.log(newData);
    }

    if(this.state.gym == true){
       newData = newData.filter((item) =>{
         if(item.extras.indexOf('gym') >=0){
          return item
         }
      })
      console.log(newData);
    }

    this.setState({
      filteredData: newData
    })
  }

  populateForms() {
    // City
    var cities = this.state.listingData.map((item) => {
      return item.city
    })
    cities = new Set(cities)
    cities = [...cities]
    cities = cities.sort()

    // homeType
    var homeTypes = this.state.listingData.map((item) => {
      return item.homeType
    })
    homeTypes = new Set(homeTypes)
    homeTypes = [...homeTypes]
    homeTypes = homeTypes.sort()

    // bedrooms
    var bedrooms = this.state.listingData.map((item) => {
      return item.rooms
    })
    bedrooms = new Set(bedrooms)
    bedrooms = [...bedrooms]
    bedrooms = bedrooms.sort()

    this.setState({
      populateFormsData: {
        homeTypes,
        bedrooms,
        cities
      }
    })
  }

  render () {
    return (
      <div>
        <Header />
        <section id="content-area">
        <Filter change={this.change} globalState={this.state} populateAction={this.populateForms} />
        <Listings listingData={this.state.filteredData} change={this.change} changeView={this.changeView}  globalState={this.state}/>
        </section>
      </div>
    )
  }
}

const app = document.getElementById('app')

ReactDOM.render(<App />, app)
