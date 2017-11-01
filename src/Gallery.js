import React from 'react';
import firebase, { auth, provider } from './firebase.js';
import {format} from 'date-fns';

class GalleryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: "",
      loading: true
    };
  }
  componentDidMount() {
    const storageRef = firebase.storage().ref(`images/${this.props.item.image}`);

    storageRef.getDownloadURL().then((url) => {
      this.setState({src: url});
    });
  }
  handleImageLoaded() {
    this.setState({ loading: false });
  }
  render () {
    let date = format(new Date(this.props.item.date), "Do MMMM YYYY");
    return (
      <figure className="gallery-item">
        <div className={this.state.loading ? "gallery-image-holder loading" : "gallery-image-holder"}>
          <img className={this.state.loading ? "loading" : ""}
               onLoad={this.handleImageLoaded.bind(this)}
               src={this.state.src} />
        </div>
        <figcaption className="caption">{this.props.item.title}, {this.props.item.filter} - {date}</figcaption>
      </figure>
    )
  }
}

class Gallery extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      grid: true
    };
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          image: items[item].image,
          title: items[item].title,
          filter: items[item].filter,
          date: items[item].date
        });
      }
      this.setState({
        items: newState
      });
    });
  };

  render () {
    let items = this.state.items.map((item) => {
      return (
        <GalleryItem key={item.id} item={item} />
      )
    });
    return (
      <main>
        <button
          onClick={() => this.setState({ grid: !this.state.grid})}
          className={this.state.grid ? "btn btn-primary" : "btn"}>Grid view</button>
        <section className={this.state.grid ? "gallery grid-view" : "gallery full-view"}>
          {items}
        </section>
      </main>
    )
  }
}

export default Gallery;
