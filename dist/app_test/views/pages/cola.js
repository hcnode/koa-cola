"use strict";
/**
 * react page 组件
 * 使用redux-connect的注解使react组件变成react-redux，并在此基础上封装了服务器端异步connect
 *
 * react-redux教程
 * http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
// import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer } = app.decorators.view;
// import { EventCola } from '../../../src/decorators/event-cola';
// import { SyncReducer as Reducer } from '../../../src/decorators/reducer';
var loadSuccess = store.loadSuccess;
exports.pepsi = 'this is pepsi-cola';
exports.pepsi2 = 'this is pepsi-cola again';
exports.coca = 'this is coca-cola';
exports.coca2 = 'this is coca-cola again';
exports.timeout = 500;
let App = class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cola: ''
        };
    }
    render() {
        var result = React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("h2", null, "koa-cola")),
            React.createElement("div", { id: "pepsi" }, this.props.pepsi),
            React.createElement("div", { id: "coca" }, this.props.coca),
            React.createElement("div", { id: "cola" }, this.state.cola),
            React.createElement("button", { id: "btn1", onClick: () => {
                    this.props.onAsyncClick();
                } }, "test async"),
            React.createElement("button", { id: "btn2", onClick: () => {
                    this.props.onClick();
                } }, "click"),
            React.createElement("button", { id: "btn3", onClick: () => {
                    this.setState({ cola: 'wow' });
                } }, "setState"));
        return result;
    }
};
App.defaultProps = {
    pepsi: exports.pepsi,
    coca: ''
};
App = __decorate([
    asyncConnect([{
            key: 'coca',
            promise: ({ params, helpers }) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(exports.coca), exports.timeout);
            })
        }], 
    // mapStateToProps
    ({ pepsi }) => {
        return {
            pepsi
        };
    }, 
    // mapDispatchToProps
    (dispatch) => {
        return {
            onClick: () => {
                dispatch({ type: 'click' });
            },
            onAsyncClick: async () => {
                var data = await new Promise((resolve, reject) => {
                    setTimeout(() => resolve(exports.coca2), exports.timeout);
                });
                dispatch(loadSuccess('coca', data));
            }
        };
    })
    // reducer
    ,
    SyncReducer(() => {
        return {
            pepsi: (state = exports.pepsi, action) => {
                if (action.type == 'click')
                    return exports.pepsi2;
                else
                    return state;
            }
        };
    }),
    __metadata("design:paramtypes", [Object])
], App);
;
exports.default = App;
