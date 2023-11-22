const isLoggedin = async(req, res, next)=>{
    if(req.is) return next()
    return res.json({error: "Login session is expired"})
}

const isSubscribed = async(req, res, next)=>{
    if(req.isAuthenticated () && req.user) return next()
    return res.json({error:"Subscription is expired"})
};