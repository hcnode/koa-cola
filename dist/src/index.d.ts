/**
 * colaApp 参数，可以作为可选的注入方式覆盖app的文件配置，module替换
 *
 * {
 * 		config : {
 * 			foo : 'hello world' // 将会替换app.config.foo
 * 		},
 * 		controllers : {
 * 			FooController :  // 替换api/controllers/FooController.ts
 * 		},
 * 		middlewares : {
 * 			...
 * 		},
 * 		models : {
 * 			...
 * 		},
 * 		pages : {
 * 			...
 * 		},
 * 		routers : {
 * 			...
 * 		}
 * }
 * @param colaApp
 */
export default function (colaApp?: any): any;
