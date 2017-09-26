import * as React from 'react'
import * as serialize from 'serialize-javascript';
import { renderToString } from 'react-dom/server'
export default async (html, component, layout, store, renderProps, ctx) => {
  var __data = {}
  try {
    __data = serialize(store.getState())
  } catch (error) {}
  var {
    _doNotUseLayout,
    Header,
    _bundle,
    _pagePros = {}
  } = component;
  if (_doNotUseLayout) {
    html = `
            <!doctype html>
            <html>
                ${Header ? renderToString(<Header />) : ""}
                <body><div>${html}</div></body>
                <script>
                    window.__data=${__data};
                </script>
                ${_bundle
                  ? _bundle.map(item => {
                      return `<script src='${item}'></script>`;
                    })
                  : ""}
            </html>
                `;
  } else {
    /**
         * 必须配置layout，并且必须在layout引用bundle文件
         * 浏览器端的react-redux所需要的文件由下面的injectHtml自动插入
         */
    if (layout) {
      html = layout(
        html,
        store,
        renderProps,
        typeof _pagePros == "function" ? await _pagePros(ctx) : _pagePros
      );
    } else {
      console.log(`${process.cwd()}/views/pages/layout not found`);
    }

    var injectHtml = `
                <!-- its a Redux initial data -->
                <script>
                    window.__data=${__data};
                </script>
                </html>
            `;
    if (/<\/html\>/gi.test(html)) {
      html = html.replace(/<\/html\>/gi, injectHtml);
    } else {
      html += injectHtml;
    }
  }
  return html;
};
