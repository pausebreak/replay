var demo = demo || {};
demo.replay = demo.replay || {};

(function (ns) {

    var replays = [];

    ns.save = function(state) {
        replays.push(state);
    };

    ns.at = function(idx) {
        return replays[idx];
    };

    ns.length = function() {
        return replays.length;
    };

    ns.component = React.createClass({
        displayName: "replay",
        propTypes: {
            totalReplays: React.PropTypes.number.isRequired,
            replayIdx: React.PropTypes.number.isRequired,
            goBack: React.PropTypes.func.isRequired,
            goBack: React.PropTypes.func.isRequired,
            goForward: React.PropTypes.func.isRequired
        },
        render: function() {
            return React.DOM.div({className: "replay"},
                React.DOM.div({}, "Available State Frames: " + this.props.totalReplays),
                React.DOM.button({onClick: this.props.goBack}, "<"),
                React.DOM.span({}, this.props.replayIdx+1),
                React.DOM.button({onClick: this.props.goForward}, ">")
            );
        }
    });

}(demo.replay));

