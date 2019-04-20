const getToken=(req,res,next)=>{
    const bearerHeader=req.headers.authorization;
    if(typeof bearerHeader==='undefined'){
        return res.status(403).json({
            status:403,
            error:"A token must be provided!",
        });
    }
    const bearerToken=bearerHeader.split(' ');
    const token=bearerToken[1];
    req.token=token;
    next();

}
export default getToken;