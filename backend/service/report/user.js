const {userModel} = require("../../model/userModel");

const getUser = async () => {
const result = await userModel.aggregate([
    {
        $match: {
            role: "user"
        }
    },
    {
        $group: {
            _id: null,

            totalUsers: {
                $sum: 1
            },

            blockedUsers: {
                $sum: {
                    $cond: [
                        { $eq: ["$isBlocked", true] },
                        1,
                        0
                    ]
                }
            },

            activeUsers: {
                $sum: {
                    $cond: [
                        {
                            $eq: [
                                { $ifNull: ["$isBlocked", false] },
                                false
                            ]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            totalUsers: 1,
            blockedUsers: 1,
            activeUsers: 1
        }
    }
]);

  return result[0];
};

module.exports = {getUser};