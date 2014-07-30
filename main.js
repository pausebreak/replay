var demo = demo || {};
demo.replay = demo.replay || {};

(function (ns, replay) {
    var globalState = {things: [], replayIdx: 0};

    var lastUnique=0;
    var nextUnique = function() {
        lastUnique = lastUnique+1;
        return lastUnique;
    }

    var merge = function(a, b) {
        var key, c = {};

        for (key in a) { c[key] = a[key]; }
        for (key in b) { c[key] = b[key]; }

        return c;
    };

    // this gets around mutability for now
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

        for (key in aMap) {
            globalState[key] = aMap[key]; 
        }
        
        newState = clone(globalState);

        // seeds the next state?  this needs to go away :(
        globalState.replayIdx = globalState.replayIdx+1;

        // the magic
        replay.save(newState);

        pipeline(newState);
    };

    var thingList = React.createClass({
        propTypes: {
            things: React.PropTypes.array.isRequired
        },
        displayName: "thingList",
        render: function() {
            var things;

            if (this.props.things.length) {
                things = React.DOM.ol({}, this.props.things.map(function(thing) {
                    return React.DOM.li({key: thing["key"]}, thing["name"]);
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
                    createThing: function(name) {
                        var things = clone(data.things);
                        things.push({name: name, key: nextUnique()});
                        updateState({things: things});
                    }
            }), 
            document.getElementById('things')
        );

        React.renderComponent(
            replay.component({
                totalReplays: replay.length(),
                replayIdx: data.replayIdx,
                goBack: function() {
                    var newIdx = data.replayIdx-1;
                    // hit the bottom ?
                    if (newIdx < 0) { return; }
                    //pipeline(merge(replay.at([newIdx]))); //, {replayIdx: newIdx}));
                    pipeline(replay.at(newIdx)); //, {replayIdx: newIdx}));
                },
                goForward: function() {
                    var newIdx = data.replayIdx+1;
                    // hit the top?
                    if (newIdx > replay.length()-1) { return; }
                    //pipeline(merge(replay.at([newIdx]))); //, {replayIdx: newIdx}));
                    pipeline(replay.at(newIdx)); //, {replayIdx: newIdx}));
                } 
            }),
            document.getElementById('replay')
        );
    };
 
    ns.main = function() {
        updateState(globalState);
    };

}(demo, demo.replay));

if (window.addEventListener) {
    window.addEventListener('load', demo.main, false); //W3C
} else {
    window.attachEvent('onload', demo.main); //IE
}

