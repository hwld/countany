"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var core_1 = require("@material-ui/core");
var react_1 = require("react");
var styled_components_1 = require("styled-components");
var Header_1 = require("../components/Header");
var Main_1 = require("../components/Main");
var Add_1 = require("@material-ui/icons/Add");
var CounterContainer_1 = require("../components/CounterContainer");
var Home = function (_a) {
    var className = _a.className;
    var _b = react_1.useState([]), counters = _b[0], setCounters = _b[1];
    var addCounter = function () {
        setCounters(function (counters) { return __spreadArrays(counters, [
            {
                id: Math.random().toString(),
                title: "\u65B0\u3057\u3044\u30AB\u30A6\u30F3\u30BF\u30FC",
                counts: 0,
                startWith: 0,
                countAmount: 1,
                maxValue: 100,
                minValue: -100
            },
        ]); });
    };
    var countUp = function (id) {
        setCounters(function (counters) {
            var target = counters.find(function (counter) { return counter.id === id; });
            if (!target) {
                throw Error("存在しないカウンターです");
            }
            return __spreadArrays(counters.filter(function (counter) { return counter.id !== id; }), [
                counters.find(function (counter) { return counter.id === id; }),
            ]);
        });
    };
    var countDown = function (id) { };
    var removeCounter = function (id) {
        setCounters(function (state) { return __spreadArrays(state.filter(function (state) { return state.id !== id; })); });
    };
    return (<div className={className}>
      <Header_1.Header />
      <Main_1.Main>
        <CounterContainer_1.CounterContainer counters={counters} removeCounter={removeCounter}/>
      </Main_1.Main>
      <core_1.Fab className="addCounter" color="primary" onClick={addCounter}>
        <Add_1["default"] />
      </core_1.Fab>
    </div>);
};
var StyledHome = styled_components_1["default"](Home)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 100vh;\n  background-color: ", ";\n\n  & .addCounter {\n    position: absolute;\n    right: 40px;\n    bottom: 40px;\n  }\n"], ["\n  height: 100vh;\n  background-color: ",
    ";\n\n  & .addCounter {\n    position: absolute;\n    right: 40px;\n    bottom: 40px;\n  }\n"])), function (props) {
    return props.theme.palette.background["default"];
});
exports["default"] = StyledHome;
var templateObject_1;
