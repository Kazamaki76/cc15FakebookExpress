module.exports = (req,res,next) =>{
    throw new Error("teset error middlware")  ;// เอาไว้ดู errorใน log
    res.status(404).json({ message : "resource not found on this server"})
}