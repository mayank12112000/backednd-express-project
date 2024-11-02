import { asycnHandler } from './../utils/asyncHandler.js';

const registeruser = asycnHandler(async (req,res)=>{
    res.status(200).json({
        message:"ok"
    })
})

export {registeruser}