const exp=require('express')
const userApp=exp.Router();
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressAsyncHandler=require('express-async-handler');
const verifytoken=require('../middlewares/Verifytoken');
const { CURSOR_FLAGS } = require('mongodb');


userApp.get('/get-users',verifytoken,expressAsyncHandler(async(request,response)=>{
    let userCollectionObj=request.app.get('userCollectionObj');
    let userCredObj=request.query.params1;
    console.log(request.query.params1)
    let existeduser=await userCollectionObj.findOne({username:userCredObj});
    response.send({message:"USER LIST",payload:existeduser});
}));

userApp.post('/add-candidate',verifytoken,expressAsyncHandler(async(request,response)=>{
    let user=request.body;
    let candidateCollectionObj=request.app.get('candidateCollectionObj');
    let res=await candidateCollectionObj.insertOne(user);
    console.log(res);
    response.send({message:"User INserted"})
}))

userApp.get('/get-candidates',verifytoken,expressAsyncHandler(async(request,response)=>{
    let candidateCollectionObj=request.app.get('candidateCollectionObj');
    let ownerName=request.query.params1;
    // console.log(request.query.params1)
    let existedcandidates=await candidateCollectionObj.find({username:ownerName}).toArray();
    // existedcandidates && console.log(existedcandidates);
    // for await (const doc of existedcandidates)
    //     console.log(doc)
    console.log(existedcandidates)
    // response.send({message:"USER LIST",payload:existedcandidates});
    response.json(existedcandidates)
}))

userApp.post('/post-user',expressAsyncHandler(async(request,response)=>{
    let user=request.body;
    let userCollectionObj=request.app.get('userCollectionObj');
    let existeduser=await userCollectionObj.findOne({username:user.username});
    if(existeduser!=null)
    {
        response.send({message:"User already existed"});
    }
    else
    {
        let hashedpassword=await bcrypt.hash(user.password,5);
        user.password=hashedpassword;
    let res=await userCollectionObj.insertOne(user);
    console.log(res);
    response.send({message:"User INserted"})
    }
}));

userApp.post('/login',expressAsyncHandler(async(request,response)=>{
    let userCredObj=request.body;
    let userCollectionObj=request.app.get('userCollectionObj');
    let existeduser=await userCollectionObj.findOne({username:userCredObj.username});
    if(existeduser===null)
    {
        response.send({message:"INVALID USERNAME"})
    }
    else
    {
        let equalpass=await bcrypt.compare(userCredObj.password,existeduser.password);
        if(equalpass)
        {
            let jwttoken=jwt.sign({username:userCredObj.username},'abcdef',{expiresIn:"200000"});
            response.send({message:"LOGIN SUCCESS",token:jwttoken,user:existeduser});
            
        }
        else
        {
            response.send({message:"INVALID PASSWORD"});
        }
    }
}))






module.exports=userApp;