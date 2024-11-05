// we can do using try catch or promise
// import { asyncHandler } from './asyncHandler.js';
/* using trycatch:
export const asyncHandler = (fn)=> async(req,res,next)=>{
    // it is same t0 = export const asyncHandler = (fn)=> {async()=>{}}

    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success : false,
            message: error.message
        }) 
    }
}*/

// using promise
export const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch(err=> next(err))
    }
}
