var map;
var opts = {
          streetViewControl: false,
          tilt: 0,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: new google.maps.LatLng(42.729250, -73.678942),
          zoom: 14,
					disableDefaultUI:true
        };
function initMap() {
	console.log('init');
  // Create a map object and specify the DOM element for display.

}
// dropdown menu items
var Dropdown = React.createClass({
				getInitialState: function() {
					return {
						listVisible: false,
						display: "",
            selected: this.props.list[0]
					};
				},

				select: function(item) {
          this.setState({selected: item});
          this.props.onSelect(item);
				},

				show: function() {
					this.setState({ listVisible: true });
					document.addEventListener("click", this.hide);
          document.getElementById('dropdown-glyph').setAttribute('class',"fa fa-angle-up" );
				},

				hide: function() {
					this.setState({ listVisible: false });
					document.removeEventListener("click", this.hide);
          document.getElementById('dropdown-glyph').setAttribute('class',"fa fa-angle-left" );
				},

				render: function() {
					return <div className={"dropdown-container" + (this.state.listVisible ? " show" : "")}>
            <div className="dropdown-list">

                {this.renderListItems()}

            </div>
						<button className={'fa btn btn-default' + (this.state.listVisible ? " clicked": "")} onClick={this.show}>
							<span>{this.state.selected.name}</span>
							<i id = 'dropdown-glyph' className="fa fa-angle-left"></i>
						</button>
					</div>;
				},

				renderListItems: function() {
					var items = [];
					for (var i = 0; i < this.props.list.length; i++) {
						var item = this.props.list[i];
						items.push(<div key={item.name} onClick={this.select.bind(null, item)}>
							<span>{item.name}</span>
							<hr></hr>
						</div>

					);
					}
					return items;
				}
			});

// to do list items
var TodoList = React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li key={item.id}>{item.text}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});
var ToDoPane = React.createClass({
  getInitialState: function() {
    return {items: [], text: '', locationSelected: {} };
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleLocation: function(newLocation){
    this.setState({locationSelected: newLocation});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if(this.state.text != ''){
      var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
      var nextText = '';
      this.setState({items: nextItems, text: nextText});
    }
  },
  render: function() {
    return (
      <div id='toDoPane'>
        <h3>List</h3>
        <TodoList items={this.state.items} />
        <div className = 'btn-group'>
          <form onSubmit={this.handleSubmit}>
            <input onChange={this.onChange} value={this.state.text} />
            <button className = 'fa btn btn-default'>
              <i className = 'fa fa-plus-square-o'></i>
            </button>
          </form>
          <Dropdown list={this.props.locations}  onSelect = {this.handleLocation}/>
        </div>
      </div>
    );
  }
});
var Slider = React.createClass({
	onCursorMove: function(e){
		var element = document.getElementById('slideBar');
		var min = element.offsetLeft - 5
		var max = element.offsetWidth - 5 + element.offsetLeft;
		if(e.targetTouches[0].target.id == 'cursor'){
			// console.log(min);
			// console.log(max);
			if(e.targetTouches[0].clientX>min && e.targetTouches[0].clientX < max){
				var val = e.targetTouches[0].clientX - element.offsetLeft
				var pos = val.toString();
				document.getElementById('cursor').style.left = pos+'px';
				this.props.setVal((val + 5)/element.offsetWidth);
			}
		}
	},
	render: function() {
		return(
			<div className = 'slider container' id = 'slideBar'>
				<hr>
				</hr>
				<div className = 'slider cursor' id = 'cursor' onTouchMove={this.onCursorMove}>
				</div>
			</div>
		);
	}
});


var LocationPane = React.createClass({
  getInitialState: function() {
    return {};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if(this.state.text != ''){
      var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
      var nextText = '';
      this.setState({items: nextItems, text: nextText});
    }
  },
	handleLocation: function(newLocation){
		this.props.panTo(newLocation);
	},
  render: function() {
    return (
      <div id='locationPane' className = 'hidePane' >
        <h3>Location Manager</h3>
				<div id = 'map' ></div>
				<div className = 'bttn clstr'>
					<Dropdown list={this.props.locations} onSelect = {this.handleLocation}/>
					<button className = 'fa btn btn-default add'>
						<i className = 'fa fa-plus-square-o'></i>
					</button>
					<Slider setVal = {this.props.changeRadius}/>
				</div>

      </div>

    );
  }
});

var Carousel = React.createClass({
	getInitialState: function(){
		return {
			touchStart: {x: 0, y: 0},
			targetTouch: '',
			createdMap: false,
			circleMap: {},
			selectedLoc: {},
			locations: [
				{name: ''},
				{name: 'home',
				center: {lat: 42.950040, lng: -77.588811},
				radius: 5},
				{name: 'work',
				center: {lat: 42.952164, lng: -77.588868},
				radius: 5},
				{name: 'pool house',
				center: {lat: 42.957364, lng: -77.568422},
				radius: 5}
			]
		};
	},
	handleSwipeStart: function(e){
		// console.log(e.changedTouches[0].clientX);
		// console.log(e.changedTouches[0].clientY);
		this.setState({touchStart:{x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}});
		this.setState({targetTouch: e.targetTouches[0].target.id});
		// console.log(e);
	},
	handleSwipeEnd: function(e){
		if(this.state.touchStart.x - e.changedTouches[0].clientX >= 50 && this.state.targetTouch == 'toDoPane'){
			console.log('swipe left');
			document.getElementById('toDoPane').setAttribute('class', 'hidePane');
			document.getElementById('locationPane').setAttribute('class', 'showPane');
			if(!this.state.createdMap){
				console.log('init map');
				map = new google.maps.Map(document.getElementById('map'), opts);
				this.setState({createdMap: true});
				for (var i in this.state.locations){
					var loc = this.state.locations[i];
					this.state.circleMap[loc.name] = new google.maps.Circle({
            strokeColor: '#3366ff',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#3366ff',
            fillOpacity: 0.35,
            map: map,
						draggable: true,
            center: loc.center,
            radius: loc.radius
          });
				}
			}
		}
		if(this.state.touchStart.x - e.changedTouches[0].clientX <= -50 && this.state.targetTouch == 'locationPane'){
			console.log('swipe right');
			document.getElementById('toDoPane').setAttribute('class', 'showPane');
			document.getElementById('locationPane').setAttribute('class', 'hidePane');
		}
	},
	changeRadius: function(val){
		console.log(this.state.circleMap[this.state.selectedLoc.name].radius);
		this.state.circleMap[this.state.selectedLoc.name].setRadius(val * 100);
	},
	panTo: function(location){
		map.panTo(this.state.circleMap[location.name].getCenter());
		this.setState({selectedLoc: location});
	},
	render: function(){

		return(
			<div id='appRoot' onTouchStart={this.handleSwipeStart} onTouchEnd={this.handleSwipeEnd}>
				<ToDoPane locations = {this.state.locations}/>
				<LocationPane panTo = {this.panTo} locations = {this.state.locations} changeRadius = {this.changeRadius}/>
			</div>
		);

	}

});

ReactDOM.render(
  <Carousel/>,
  document.getElementById('appView')
);
