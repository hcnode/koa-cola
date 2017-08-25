export const userSchema = function(mongoose){
    return {
        name: {
            type : String
        },
        email : {
            type : String
        }
    }
}