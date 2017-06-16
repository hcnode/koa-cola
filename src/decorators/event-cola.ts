import 'reflect-metadata';
import * as React from 'react';
const EVENT_PREFIX = "#EVENT_PREFIX";
function getEvents(vd){
  var props = vd.props || {}, children = props.children;
  var events = [];
  if(props.id && props.onClick){
    events.push({
      id : props.id,
      onClick : props.onClick
    })
  }
  if(children && children.length > 0 && children.forEach){
    children.forEach((child : any) => {
      events = events.concat(getEvents(child));
    });
  }
  return events;
}
export function EventCola() {
  return function(target) {
    if(target.prototype.render){
      var _render = target.prototype.render;
      target.prototype.render = function(){
        var result = _render.apply(this, arguments);
        var events = getEvents(result);
        var wrapper = React.createElement('div', {}, result
          , React.createElement("script", { dangerouslySetInnerHTML: { __html: `
          var __events = ${JSON.stringify(events.map(({id, onClick}) => id))};
          `
        } })
        );
        Reflect.defineMetadata(EVENT_PREFIX, events, target);
        return wrapper;
      }
    }
  };
};
