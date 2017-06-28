"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var React = require("react");
var EVENT_PREFIX = "#EVENT_PREFIX";
function getEvents(vd) {
  var props = vd.props || {},
      children = props.children;
  var events = [];
  if (props.id && props.onClick) {
    events.push({
      id: props.id,
      event: 'click'
    });
  }
  if (children && children.length > 0 && children.forEach) {
    children.forEach(function (child) {
      events = events.concat(getEvents(child));
    });
  }
  return events;
}
function EventCola() {
  return function (target) {
    if (target.prototype.render) {
      var _render = target.prototype.render;
      target.prototype.render = function () {
        var result = _render.apply(this, arguments);
        var location = this.props.location;

        var isCola = false;
        if (location && location.query && location.query['event-cola']) {
          isCola = true;
        }
        // disabled
        return result;
        var events = getEvents(result);
        var wrapper = React.createElement('div', {}, result, React.createElement('input', {
          id: 'data-cola',
          value: JSON.stringify(events),
          type: 'hidden'
        }), isCola ? null : React.createElement("script", {
          dangerouslySetInnerHTML: {
            __html: "\nfunction __ajax(c){\n  if (!c.url) return false;\n  var r = (window.XMLHttpRequest) ? (new XMLHttpRequest()) : (new ActiveXObject(\"Microsoft.XMLHTTP\"));\n  r.open((c.type || \"GET\"), c.url, ((c.async == undefined) ? (true) : (c.async ? true : false)));\n  for(var k in c.headers){\n    var v = c.headers[k];\n    r.setRequestHeader(k, v);\n  }\n  r.onreadystatechange = function () {\n    if (this.readyState == 4 && this.status == 200) {\n        (typeof (c.success) == \"function\") && (c.success(this.responseText));\n    }\n  }\n  r.onerror = function () { if (c.error) c.error() };\n  r.send((c.data || \"\"));\n  if (c.timeout) setTimeout(function () { r && r.abort() }, c.timeout);\n  return true;\n}\n\neval('window.__events = ' + document.getElementById('data-cola').value);\nfunction __listen (element, event, handler){\n  if(element.attachEvent){\n    element.attachEvent('on' + event, handler);\n  }else{\n    element.addEventListener(event, handler, false);\n  }\n}\nfunction colaBind(){\n  for(var i=0;i<__events.length;i++){\n    (function(event){\n      __listen(document.getElementById(event.id), event.event, function(){\n        var url = location.href;\n        if(/event-cola=(\\{.+?\\})/.test(url)){\n          url = url.replace(RegExp.$1, '{\"id\":\"'+ event.id +'\", \"event\" : \"'+ event.event +'\"}')\n        }else{\n          url += (url.indexOf('?') > -1 ? '&' : '?') + 'event-cola={\"id\":\"'+ event.id +'\", \"event\" : \"'+ event.event +'\"}'\n        }\n        __ajax({\n          url : url,\n          success : function(html){\n            document.body.innerHTML = html;\n            eval('window.__events = ' + document.getElementById('data-cola').value);\n            colaBind();\n          }\n        })\n      })\n    })(__events[i])\n  }\n}\ncolaBind();\n          "
          }
        }));
        // Reflect.defineMetadata(EVENT_PREFIX, events, target);
        return wrapper;
      };
    }
  };
}
exports.EventCola = EventCola;
;