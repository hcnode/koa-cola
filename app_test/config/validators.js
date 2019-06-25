module.exports = {
    validators : {
         form : {
            path: '/validatePost', // 需要验证的url，包括浏览器端的form提交前的验证，以及服务器端的中间件的验证
            fields: [
                {
                    // 允许空的字段
                    name: 'allowEmpty', 
                    allowEmpty: true
                },
                {
                    // 不允许为空的字段，并且提供了验证的正则表达式
                    name: 'account',
                    validate: /[0-9a-zA-Z]{6,}/ig,
                    allowEmpty: false,
                    msg: '不能为空'
                },
                {
                    // 不允许为空的字段，并且提供了验证的函数
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