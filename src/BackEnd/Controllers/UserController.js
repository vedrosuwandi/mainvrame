const User = require('../Models/UserModel');

const index = (req, res) => {
    //db.collection.find()
    User.find({}).
    //then send the response in json format
    then((response)=>{
        res.json({
            response
        })
    }).catch((error)=>{
        res.json({
            message : "An Error Occured"
        })
    })
}


//Create document to User collection
const create = (req, res) =>{
    let user = new User({
        N : req.body.FullName,
        Username : req.body.Username,
        Contact : {
            Email : req.body.Email,
            Phone : req.body.Phone
        },
        Currency : req.body.Currency
    });
    
    user.save().then((response)=>{
        res.json({
            response,
            message : "Data Added"
        });
    }).catch((err)=>{
        console.log(err.message);
        res.json({
            user : user,
            message: err.message
        })
    });
}

//Update
const update = (req, res, next) =>{
    let username = req.body.Username;

    let data = {
        Currency : req.body.Currency
    }

    User.findOneAndUpdate({Username : username} , {
        $set : data
    }).then((response)=>{
        res.json({
            response,
            message : "Data Updated"
        })
    }).catch((err)=>{
        res.json({
            username : username,
            data : data,
            message : "Update Failed"
        })
    })

}

// Top Up Currency
const topup = (req, res, next) =>{
    const username = req.params.Username

    User.findOneAndUpdate({Username : username} , {
        $inc : {
            'Currency' : 20000
        }
    }).then((response)=>{
        res.json({
            response,
            message : "Data Updated"
        })
    }).catch((err)=>{
        res.json({
            username : username,
            data : data,
            message : "Update Failed"
        })
    })

}

//Show Specific User based on FullName
const show = (req, res) =>{
    let FullName = req.body.FullName;
    User.findOne({FullName : FullName}).then((response)=>{
        res.json({
            response,
        })
    }).catch((error)=>{
        res.json({
            message : "An Error Occured"
        })
    })
}

const remove = (req, res) =>{
    let username = req.body.Username;
    User.deleteOne({Username : username})
    .then((response)=>{
        if(response.deletedCount === 0){
            res.json({
                message : `There is no data with username ${username}`
            })
        }else{
            res.json({
                response,
            })
        }
    }).catch((error)=>{
        res.json({
            message : "Data Not Deleted"
        })
    })
}

// Show Specific using Query
const show_spec = (req, res) =>{
    const username = req.params.Username;
    User.findOne({Username : username}).then((response)=>{
        res.json({
            response
        })
    }).catch((error)=>{
        res.json({
            message : "An Error Occured"
        })
    })

}

module.exports = {
    index, show, create, topup, update, show_spec, remove 
}