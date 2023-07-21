const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const crypto = require('crypto');

const { User } = require('../models');
const Email = require('./../utils/email');

const signToken = id => {
    return jwt.sign({id : id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
};


const createSendToken = (user,statusCode,res)=>{
    const token = signToken(user._id);

    res.status(statusCode).json({
        status : 'success',
        token,
        data : {
            user
        }
    })
}

exports.signup = async(req,res,next)=>{

    try{
        console.log("signup endpoint");
        const newUser = await User.create({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : req.body.password,
            passwordConfirm : req.body.passwordConfirm
        });
        
        const url = 'httpp://www.google.com';
        await new Email(newUser, url).sendWelcome();
        
        createSendToken(newUser,201,res);

        
    }
    catch(error){
        console.log("Error Type : ", error.name)
        if (error.name === 'ValidationError') {
            // Erreur de validation Mongoose
            const validationErrors = {};
      
            // Personnaliser les messages d'erreur
            for (const field in error.errors) {
              const errorMessage = error.errors[field].message;
              validationErrors[field] = errorMessage;
            }

            return res.status(400).json({ 
                status : "fail",
                message : {
                    errors: validationErrors 
                }
            });
        }
        return next(createError(500))
    }
    
};


exports.login = async(req,res,next)=>{

    try {
        const {email,password} = req.body;

        console.log("login endpoint");
    
        //1 check if email and password exist
        if(!email || !password){
            return next(createError(400, 'Please provide email and password'));
        }

        //2 check if user exists and password is correct
        const user = await User.findOne({email : email }).select('+password');
        console.log(user);


        if(!user || !(await user.correctPassword(password,user.password))){
            //401 is unauthorized
            return next(createError( 401,'Incorrect email or password'));
        }
    
        // //if everything ok send the token to client
        createSendToken(user,200,res);
    }
    catch(error)
    {
        console.log("Error Type : ", error.name)
        if (error.name === 'ValidationError') {
            // Erreur de validation Mongoose
            const validationErrors = {};
      
            // Personnaliser les messages d'erreur
            for (const field in error.errors) {
              const errorMessage = error.errors[field].message;
              validationErrors[field] = errorMessage;
            }

            return res.status(400).json({ 
                status : "fail",
                message : {
                    errors: validationErrors 
                }
            });
        }
        return next(createError(500))
    }
    
};


exports.protect = async (req,res,next) =>{
    try {
        console.log("protect middleware");
        let token;
        //1 getting the token a check if it exists (chheck in the headers)
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        //console.log("the token is :", token);
        if(!token){
            return next(createError( 401 ,'You are not logged in ! please log in to get access'));
        }

        // 2 thee verification step 
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        //console.log("decoded is :",decoded);


        //3check if user still exists (dans le cas ou le token est valide mais que le user n'existe plus)
        const currentUser = await User.findById(decoded.id);
        //console.log("the freshUser : ", currentUser )
        if(!currentUser){
            return next(createError(401, 'The user belonging to the token no longer exists'));
        }

        //4 check if user changed password after token was issued
        // if(currentUser.changedPasswordAfter(decoded.iat)){
        //     return next(new AppError( 'User recently changed password ! please log in again' , 401));
        // }

        //gtant access to the protected route (on le stoque dans la http response important !! )
        req.user = currentUser;
        next();
    } catch (error) {
        return next(createError(500,`something went wrong : ${error}`))
    }
    
};

exports.restrictTo = (...roles) =>{
    return (req,res,next) =>{

        console.log("restrict middleware", `roles : ${roles}`, `current user : ${req.user}`);


        if(!roles.includes(req.user.role)){
            
            return next(createError(403, 'You do not have permission to perform this action'));
        }
        next();
    }
}


exports.forgotPassword = async (req,res,next)=>{

    try {
        // console.log("forgot password endpoint");
        //1 find user based on POSTed email
        const user = await User.findOne({email : req.body.email});
        if(!user)
        {
            return next(createError(404,'There is no user with this email adress'));
        }
        //2 generate the random reset token
        const resetToken = user.createPasswordResetToken();
        console.log(resetToken);
        // do not forget to persist the modifications we did in the previous step, otherwise they won't be effective. 
        await user.save({validateBeforeSave : false});
        console.log("user :" + user);
        //3 send it to user's email
        

        // const message = `Forgot tour password ? Submit a PATCH request with your new password and
        //             passwordConfirm to : ${resetURL}.\n If you didn't forget your password, please ignore this email !`;

        try {
            // await sendEmail({
            //     email : user.email,
            //     subject : 'Your password reset token (valid for 10 minutes)',
            //     message
            // })

            const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
            await new Email(user,resetURL).sendPasswordReset();
        
            res.status(200).json({
                status : 'success',
                message : 'Token sent to email'
            })
        } 
        catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validateBeforeSave : false});
            console.log("email sending error : ", error);
            return next(createError(500,'There was an error while sending the mail. try again later '));
        }
        
    } catch (error) {
        return next(createError(500,`something went wrong : ${error}`))
    }
    
    
};


exports.resetPassword =  async (req,res,next)=>{

    try {
        //steps 
        //1 find the user using the token 
        console.log("url token : ",req.params.token);
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        // console.log("hashed tken : ",hashedToken);
    
        let user = await User.findOne({
                                    passwordResetToken : hashedToken,
                                    //attention ici j'approxime vu qu'il y'a un décalage horaire (cela pourrait poser problème)
                                    passwordResetExpires : {$gt : Date.now() - 2 * 60 * 60 * 1000 }
                                });

        //2 if token has not expired and there is a user then set the new password 
        // console.log(user.passwordResetExpires,(new Date(Date.now() - 2 * 60 * 60 * 1000)).toString());
        console.log(user);
        if(!user)
        {
            return next(createError(404,'Token is invalid or has expired '));
        }
        
        
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        //3 Update the changedPasswordAt property for the user
        //4 Log the user in, send JWT
        createSendToken(user,200,res);
    } catch (error) {
        return next(createError(500,`something went wrong : ${error}`))
    }
    



};



exports.updatePassword = async (req,res,next)=> {

    try {
        //1 get user from collection
        //the protect middleware carries the current logged in user
        console.log("update password endpoint");
        const user = await User.findById(req.user.id).select('password');

        //2 check if POSTed current password is correct
        if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
            return next(createError(401,'Your current password is wrong '));
        }

        //3 if so update password 
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();
        //User.findByIdAndUpdate will not work as intended


        //4 Log user in, send jwt token
        createSendToken(user,200,res);
    } catch (error) {
        return next(createError(500,`something went wrong : ${error}`))
    }
    
};