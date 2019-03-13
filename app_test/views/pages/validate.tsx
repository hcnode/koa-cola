import * as React from 'react';
import {validateForm} from "../../../client"
import {validators} from '../../config/validators'
import axios from 'axios'
var ValidateForm = validateForm(validators.form);
class Page extends React.Component<any, any>   {
  constructor(props: any) {
      super(props);
      this.state = {body : {}, result : {}};
  }
  validateForm = null
  render() {
    return <div>
      <ValidateForm ref={instance => { this.validateForm = instance; }}>
        allow empty:&nbsp;<input type="text" name="allowEmpty"/><br/>
        account:&nbsp;<input type="text" name="account"/><br/>
        number:&nbsp;<input type="text" name="number"/><br/>
        <input type="submit" value="submit by posting form"/>&nbsp;
        <input type="button" value="get post data by validate" onClick={() => {
          var body = this.validateForm.getBody();
          this.setState({body})
        }} />&nbsp;
        <input type="button" value="post data by ajax" onClick={async () => {
          try {
            var result = await axios({
              url : validators.form.path,
              method : 'post',
              data : this.state.body
            })
            this.setState({result : result.data})
          } catch (error) {
            console.log(error)
          }
        }} />
      </ValidateForm>
      <div>
        post body:{JSON.stringify(this.state.body)}
      </div>
      <div>
        result:{JSON.stringify(this.state.result)}
      </div>
    </div>
  }
};
export default Page