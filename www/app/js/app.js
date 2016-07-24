
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
              <div>
                {this.renderListItems()}
              </div>
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
							<i className="fa fa-square"></i>
						</div>);
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
var TodoApp = React.createClass({
  getInitialState: function() {
    return {items: [],locations: [{name: 'home'},{name: 'work'}], text: '', locationSelected: {} };
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
      <div id='appRoot'>
        <h3>TODO</h3>
        <TodoList items={this.state.items} />
        <div className = 'btn-group'>
          <form onSubmit={this.handleSubmit}>
            <input onChange={this.onChange} value={this.state.text} />
            <button className = 'fa btn btn-default'>
              <i className = 'fa fa-plus-square-o'></i>
            </button>
          </form>
          <Dropdown list={this.state.locations} onSelect = {this.handleLocation}/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <TodoApp/>,
  document.getElementById('appView')
);
