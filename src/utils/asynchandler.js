
//middleware  it handle async function that detect the error and pass to next middlewarwe
const asyncHandler=(requestHandler)=>{
     return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}

export {asyncHandler}