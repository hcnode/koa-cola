import * as React from 'react';
import { validateFunc } from '../middlewares/validate'
/**
 * post表单验证中间件
 * conf ={
 *  path,
 *  fields : [
 *      {
 *          name,
 *          validate,
 *          allowEmpty, // default is false
 *          msg,
 *      }
 *  ],
 *  onError,
 * }
 */
export default (conf, url?) => {
    return class ValidateFrom extends React.Component<any, any> {
        constructor(props: any) {
            super(props);
            this.submit = this.submit.bind(this)
        }
        form = null
        iterateFields (onError, onValidate?){
            var form = this.form;
            var fields = Array.from(form.elements);
            for (var field of conf.fields) {
                var elField: any = fields.find(({ name }) => name == field.name)
                if (!validateFunc({
                    body: !elField ? {} : { [field.name]: elField.value },
                    name: field.name, validate: field.validate, allowEmpty: field.allowEmpty
                })) {
                    return onError(field, elField);
                   
                }else{
                    onValidate && onValidate(field, elField);
                }
            }
        }
        submit(event) {
            this.iterateFields((field, elField) => {
                conf.onError(field.msg)
                return event.preventDefault();
            })
        }
        getBody() {
            var body = {};
            this.iterateFields((field, elField) => {
                conf.onError(field.msg)
            }, (field, elField) => {
                if(elField){
                    body[field.name] = elField.value;
                }
            })
            return body;
        }
        render() {
            return <form method="post" action={url || conf.path} ref={form => this.form = form} onSubmit={this.submit}>
                {this.props.children}
            </form>
        }
    }
}