    
    const PostCollection = require("../models/PostSchema")

const createPost = async(req,res)=>{
    const {title,discription,file} = req.body
    let userId = req.user._id;
    try {  
       let data = await PostCollection.create({
        title,
        discription,
        file,
        userId
       }) 
       res.json({msg:"post created successfully",success:true,data})
    } catch (error) {
        res.json({msg:"error in creating post",success:false,error:error.message})
        
    }

}

const updatePost = async(req,res)=>{

    
}

const deletePost = async(req,res)=>{
    let postId = req.params._id
    try {
        let data = await PostCollection.findByIdAndDelete(postId);
        res.json({msg:"post deletedd succesfuly",success:true})
    } catch (error) {
        res.json({msg:"error in deleting post",success:false,error:error.message})
        
    }
    
}
const getAllUserPost = async(req,res)=>{
    try {
        //  let data = await PostCollection.find().populate({path:'userId',select:'nmae'});
        let data = await PostCollection.find().populate({path:'userId',select:'name'}).populate({
            path:'comments',
            populate:{
                path:'user',
                select:'name'
            }
        });

        return res.json({msg:"post fetched successfully",data,success:true})
        
    } catch (error) {
        return res.json({msg:"error in getting posts",error:error.message,success:false})
        
    }

    
}
const  getSingleUserPost = async(req,res)=>{
    let _id = req.user._id;
    console.log(req._user)
    try {
        let data = await PostCollection.find({userId:_id});
        res.json({msg:"post find successfully",success:true,data})
    } catch (error) {
        res.json({msg:"error in getting post",success:false,error:error.message})
        
    }
    
}

 const updateLike = async(req,res)=>
 {
    let postId = req.params.postId
    let userId = req.user._id;

    try {
        let post = await PostCollection.findById(postId);
        if(post.likes.includes(userId)){
            await post.likes.pull(userId)
        }else{
            await post.likes.push(userId)
        }
        await post.save();
        res.json({msg:"post like updated successfuly",success:true})
        
    } catch (error) {
        res.json({msg:"error in updating likes",success:false,error:error.message})
        
    }
 }



const addComment = async(req,res)=>{
    let postId = req.params.postId;
    const {text} = req.body;
    let userId = req.user._id;

    try {
        let post = await PostCollection.findById(postId);
    await post.comments.push({user:userId,text:text})
    await post.save()
    return res.json({msg:"comment added successfuly", success:true})
    } catch (error) {
        res.json({msg:"error in adding comment",success:false,error:error.message})
    }
    
}
//  const getSinglePostComments = async(req,res)=>{
//      let postId =req.params.postId
//     let post = await PostCollection.findById(postId).populate({path:'comments'});
//     res.json({msg:"comment fetched successfully",comments:post.comments})
//  }
 const deleteComment = async(req,res)=>{
    const{postId,commentId} = req.params;
   console.log("postid =",postId) 
   console.log("commentId =",commentId)
   let post = await PostCollection.findById(postId)
   console.log(post.comments)
   await post.comments.pull({_id:commentId})
   await post.save()
   res.json({msg:"comment is deleted successfuly"})
   
 }

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllUserPost,
    getSingleUserPost,
    updateLike, 
    addComment,
    //  getSinglePostComments,
     deleteComment
}