const express=require('express')

const router=express.Router();

router.get('/fetchAllNotes',(req,res,next)=>{
   obj={
      name:'java'
   }
   res.json(obj);
})

module.exports=router