
const isLogin = async(req, res, next)=>{
    if(req.is) return next()
    return res.json({})
}

is