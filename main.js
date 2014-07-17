var demo = {};

(function (ns) {

    var thingHolder = [];

    var globalState = {things: thingHolder};

    var updateState = function(aMap) {
        var key;
        for (key in aMap) {
           globalState[key] = aMap[key]; 
        }
        ns.main();
    };

    var thingList = React.createClass({
        displayName: "thingList",
        render: function() {
            var things;

            if (this.props.things && this.props.things.length) {
                things = React.DOM.ol({}, this.props.things.map(function(thing) {
                    return React.DOM.li({key: thing}, thing);
                }));
            } else {
                things = "nothing :(";
            }

            return React.DOM.div({}, 
                React.DOM.h1({}, "The Things"),
                things);
        }
    });

    var thingGenerator = React.createClass({
        displayName: "thingGenerator",
        getInitialState: function() {
            return {value: ""};
        },
        onChange: function(e) {
            this.setState({value: e.target.value});
        },
        onSubmit: function(e) {
            this.props.createThing(this.state.value);
            this.setState({value: ""});
        },
        render: function() {
            return React.DOM.div({},
                React.DOM.input({type: "text", 
                                 value: this.state.value, 
                                 ref: "thething", 
                                 onChange: this.onChange}),
                React.DOM.button({onClick: this.onSubmit}, "Go!")
            );
        }
    });

    var things = React.createClass({
        displayName: "things",
        render: function() {
            return React.DOM.div({}, 
                    React.DOM.h1({}),
                    thingGenerator({createThing: this.props.createThing}), 
                    thingList({things: this.props.things}));
        }
    });

    var pipeline = function(state) {
        React.renderComponent(
            things({things: state.things, 
                    createThing: function(thing) {
                        thingHolder.push(thing);
                        updateState({things: thingHolder});
                    }
            }), 
            document.getElementById('game')
        );
    };
 
    ns.main = function() {
        console.log("ns.main called", globalState);
        pipeline(globalState);
    };

}(demo));

if (window.addEventListener) {
    window.addEventListener('load', demo.main, false); //W3C
} else {
    window.attachEvent('onload', demo.main); //IE
}

