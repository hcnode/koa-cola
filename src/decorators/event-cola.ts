import 'reflect-metadata';
import * as React from 'react';
const EVENT_PREFIX = "#EVENT_PREFIX";
function getEvents(vd) {
  var props = vd.props || {}, children = props.children;
  var events = [];
  if (props.id && props.onClick) {
    events.push({
      id: props.id,
      event: 'click'
    })
  }
  if (children && children.length > 0 && children.forEach) {
    children.forEach((child: any) => {
      events = events.concat(getEvents(child));
    });
  }
  return events;
}
export function EventCola() {
  return function (target) {
    if (target.prototype.render) {
      var _render = target.prototype.render;
      target.prototype.render = function () {
        var result = _render.apply(this, arguments);
        var { location } = this.props;
        var isCola = false;
        if(location && location.query && location.query['event-cola']){
          isCola = true;
        }
        // disabled
        return result;
        var events = getEvents(result);
        var wrapper = React.createElement('div', {}, result
          , React.createElement('input', {
            id : 'data-cola',
            value : JSON.stringify(events),
            type : 'hidden'
          }), isCola ? null : React.createElement("script", {
            dangerouslySetInnerHTML: {
              __html: `
function __ajax(c){
  if (!c.url) return false;
  var r = (window.XMLHttpRequest) ? (new XMLHttpRequest()) : (new ActiveXObject("Microsoft.XMLHTTP"));
  r.open((c.type || "GET"), c.url, ((c.async == undefined) ? (true) : (c.async ? true : false)));
  for(var k in c.headers){
    var v = c.headers[k];
    r.setRequestHeader(k, v);
  }
  r.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        (typeof (c.success) == "function") && (c.success(this.responseText));
    }
  }
  r.onerror = function () { if (c.error) c.error() };
  r.send((c.data || ""));
  if (c.timeout) setTimeout(function () { r && r.abort() }, c.timeout);
  return true;
}

eval('window.__events = ' + document.getElementById('data-cola').value);
function __listen (element, event, handler){
  if(element.attachEvent){
    element.attachEvent('on' + event, handler);
  }else{
    element.addEventListener(event, handler, false);
  }
}
function colaBind(){
  for(var i=0;i<__events.length;i++){
    (function(event){
      __listen(document.getElementById(event.id), event.event, function(){
        var url = location.href;
        if(/event-cola=(\\{.+?\\})/.test(url)){
          url = url.replace(RegExp.$1, '{"id":"'+ event.id +'", "event" : "'+ event.event +'"}')
        }else{
          url += (url.indexOf('?') > -1 ? '&' : '?') + 'event-cola={"id":"'+ event.id +'", "event" : "'+ event.event +'"}'
        }
        __ajax({
          url : url,
          success : function(html){
            document.body.innerHTML = html;
            eval('window.__events = ' + document.getElementById('data-cola').value);
            colaBind();
          }
        })
      })
    })(__events[i])
  }
}
colaBind();
          `
            }
          })
        );
        // Reflect.defineMetadata(EVENT_PREFIX, events, target);
        return wrapper;
      }
    }
  };
};