export default function createErrorPage({
    env,
    ctx,
    error,
    stack,
    status = 500,
    code = 500
}){
    try{
        var pageError = require(`${process.cwd()}/views/pages/${status}`)
    }catch(err){
        // some errors will have .status
		// however this is not a guarantee
		ctx.status = status || 500;
		ctx.type = 'html';
		ctx.body = `
            <p>${error}</p>
            <p>${stack}</p>
        `;
    }
}