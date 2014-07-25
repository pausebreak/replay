var demo = {};

(function (ns) {

    var replays = [];

    var globalState = {things: [], replayIdx: -1};

    var saveReplayState = function(state) {
        replays.push(state);
    };
    var replayState = function(idx) {
        pipeline(replays[idx]);
    };
    var replayLength = function() {
        return replays.length;
    };

    var merge = function(a, b) {
        var key, c = {};

        for (key in a) { c[key] = a[key]; }
        for (key in b) { c[key] = b[key]; }

        return c;
    };

    // this gets around immutability for now
    var clone = function(subject) {
        var i, 
            newObj = (subject instanceof Array) ? [] : {};

        for (i in subject) {
            if (typeof subject[i] == "object" || typeof subject == "array") {
                newObj[i] = clone(subject[i]);
            } else {
                newObj[i] = subject[i];
            } 
        }
        return newObj;
    };

    var updateState = function(aMap) {
        var key, newState;

        globalState["replayIdx"] = globalState["replayIdx"]+1;
        
        for (key in aMap) {
            globalState[key] = aMap[key]; 
        }

        newState = clone(globalState);

        // the magic
        saveReplayState(newState);

        pipeline(newState);
    };

    var replay = React.createClass({
        displayName: "replay",
        propTypes: {
            goBack: React.PropTypes.func.isRequired,
            goForward: React.PropTypes.func.isRequired
        },
        render: function() {
            return React.DOM.div({className: "replay"},
                React.DOM.div({}, "Available Replays: " + this.props.totalReplays),
                React.DOM.button({onClick: this.props.goBack}, "<"),
                React.DOM.span({}, this.props.replayIdx),
                React.DOM.button({onClick: this.props.goForward}, ">")
            );
        }
    });

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

    var pipeline = function(data) {
        React.renderComponent(
            things({things: data.things, 
                    createThing: function(thing) {
                        var things = clone(data.things);
                        things.push(thing);
                        updateState({things: things});
                    }
            }), 
            document.getElementById('game')
        );

        React.renderComponent(
            replay({totalReplays: replayLength(),
                    replayIdx: data.replayIdx,
                    goBack: function() {
                        var newIdx = data.replayIdx-1;
                        // hit the bottom ?
                        if (newIdx < -1) { return; }
                        pipeline(merge(replays[newIdx], {replayIdx: newIdx}));
                    },
                    goForward: function() {
                        var newIdx = data.replayIdx+1;
                        // hit the top?
                        if (newIdx >= replayLength()) { return; }
                        pipeline(merge(replays[newIdx], {replayIdx: newIdx}));
                    } 
            }),
            document.getElementById('replay')
        );
    };
 
    ns.main = function() {
        pipeline(globalState);
    };

}(demo));

if (window.addEventListener) {
    window.addEventListener('load', demo.main, false); //W3C
} else {
    window.attachEvent('onload', demo.main); //IE
}

