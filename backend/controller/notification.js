const {userNotificationModel} = require("../model/userNotificationModel");
const {getNotificationIds} = require("../utills/filterNotification");

//read
module.exports.getNotification = async(req,res) => {
   try{
    const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get notification"});
    }

    if(role !== "user"){
        return res.status(400).json({success : false , message : "only normal user can get notification"});
    }

    if(isBlocked){
        return res.status(400).json({success : false , messag : "block user can't get notification"});
    }

    const {selection = "all",status = "all"} = req.query;
    const validSelections = ["all","goal","challenge"];
    const validStatuses = ["all","read","unread"];

    if(!validSelections.includes(selection)){
        return res.status(400).json({success : false, message : "selection value is wrong"});
    }

    if(!validStatuses.includes(status)){
        return res.status(400).json({success : false, message : "status value is wrong"});
    }


    const query = {userId};
    if(status === "read"){
        query.isRead = true;
    }else if(status === "unread"){
        query.isRead = false;
    }
 
    if(selection === "goal"){
       query.notificationId = {
                $in: await getNotificationIds([
                    "goal suggestion",
                    "goal reminder"
                ])
            };
    }

    if(selection === "challenge"){
         query.notificationId = {
                $in: await getNotificationIds([
                    "challenge suggestion",
                    "challenge reminder"
                ])
            };
    }

    const notifications = await userNotificationModel.find(query).populate("notificationId")
                .sort({ createdAt: -1 });
   
    if(!notifications || notifications.length === 0){
       return res.status(400).json({success : false, message : "doesn't get the notifications"});
    }

    const notificationData = notifications.map(item => ({
            id: item._id,
            isRead: item.isRead,
            readAt: item.readAt,

            type: item.notificationId.type,
            title: item.notificationId.title,
            message: item.notificationId.message,
            relatedId: item.notificationId.relatedId,
            action: item.notificationId.action,
            createdAt: item.createdAt
    }));

    res.status(200).json({success : true, message: "notifications get successfully", notificationData});
  }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
  }
};


//update
module.exports.readNotification = async(req,res) => {
  try{
   const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to read notification"});
    }

    if(role !== "user"){
        return res.status(400).json({success : false , message : "only normal user can read notification"});
    }

     if(isBlocked){
        return res.status(400).json({success : false , messag : "block user can't read notification"});
    }

    const {id} = req.params;
    if(!id){
        return res.status(400).json({success : false , message : "does n't read notification"});
    }

    const notification = await userNotificationModel.findOneAndUpdate(
             {
                _id : id, 
                userId,
                isRead :false,
             },
             {
                $set : {
                  isRead : true,
                  readAt : new Date(),
                }
             },
             {
                new : true
             }
        );
   
    if(!notification){
        return res.status(400).json({success : false , message : "notification does not exist"});
    } 

    return res.status(200).json({success: true, message: "notification marked as read"});
   }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
   }
};


//delete
module.exports.deleteNotifications = async(req,res) => {
  try{
   const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to delete notification"});
    }

    if(role !== "user"){
        return res.status(400).json({success : false , message : "only normal user can delete notification"});
    }

    if(isBlocked){
        return res.status(400).json({success : false , messag : "block user can't delete notification"});
    }

    const {notifications} = req.body;
    if(!notifications || notifications.length === 0){
        return res.status(400).json({success : false , message : "notifications is required"});
    }

    await userNotificationModel.deleteMany({
        _id : {
            $in : notifications
        },
        userId
    });

    return res.status(200).json({success: true, message: "notifications delete successfully"});
 }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

module.exports.deleteAllNotification =async(req,res) => {
 try{
   const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to delete notification"});
    }

     if(role !== "user"){
        return res.status(400).json({success : false , message : "only normal user can delete All notification"});
    }

    if(isBlocked){
        return res.status(400).json({success : false , messag : "block user can't delete All notification"});
    }

    await userNotificationModel.deleteMany({userId}); 
    return res.status(200).json({success: true, message: "All notification delete successfully"});
  }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

