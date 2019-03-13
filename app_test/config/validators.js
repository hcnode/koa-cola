module.exports = {
    validators : {
         form : {
            path: '/validatePost',
            fields: [
                {
                    name: 'allowEmpty',
                    allowEmpty: true
                },
                {
                    name: 'account',
                    validate: /[0-9a-zA-Z]{6,}/ig,
                    allowEmpty: false,
                    msg: '不能为空'
                },
                {
                    name: 'number',
                    validate: value => {
                        return /\d+/.test(value)
                    },
                    allowEmpty: false,
                    msg: '必须为数字'
                }
            ],
            onError: msg => {
                alert(msg)
            }
        }
    }
}