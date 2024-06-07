const jwt=require('jsonwebtoken')
let verifytoken=(request,response,next)=>{
    const bearertoken=request.headers.authorization;
    if(bearertoken===undefined)
    {
        response.send({message:"UNAUTHORIZED REQUEST PLZ LOGIN FIRST..."});
    }
    else
    {
        const token=bearertoken.split(" ")[1];
        try
        {
            jwt.verify(token,"abcdef");
            next();
        }
        catch(err)
        {
            next(err);
        }
    }
}
module.exports=verifytoken