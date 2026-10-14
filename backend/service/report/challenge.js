const mongoose = require("mongoose");
const {challengeModel} = require("../../model/challengeModel");
const {previousDate,previousMonthDate} = require("../../utills/getDate");

const completeChallengeReport = async () => {
 const startDate = previousMonthDate();
 const endDate = previousDate();
const result = await challengeModel.aggregate([
    {
        $match: {
            endDate: {
                $gte: startDate,
                $lte: endDate
            }
        }
    },
    {
        $lookup: {
            from: "users",
            let: {
                challengeId: "$_id"
            },
            pipeline: [
                {
                    $match: {
                        role: "user",
                    }
                },
                {
                    $unwind: "$joinChallenges"
                },
                {
                    $match: {
                        $expr: {
                            $eq: [
                                "$joinChallenges.challengeId",
                                "$$challengeId"
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalJoinedUsers: {
                            $sum: 1
                        },
                        completedUsers: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$joinChallenges.status",
                                            "completed"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                    }
                }
            ],
            as: "userStats"
        }
    },
    {
        $project: {
            _id: 0,
            id: "$_id",
            title: 1,
            totalJoinedUsers: {
                $ifNull: [
                    { $arrayElemAt: ["$userStats.totalJoinedUsers", 0] },
                    0
                ]
            },
            completedUsers: {
                $ifNull: [
                    { $arrayElemAt: ["$userStats.completedUsers", 0] },
                    0
                ]
            }
        }
    },
    {
        $sort: {
            totalJoinedUsers: -1
        }
    }
]);

  return result;     
}


const challengeReport = async (id) => {
    const result = await challengeModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: {
                        challengeId: "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                role: "user",
                            }
                        },
                        {
                            $unwind: "$joinChallenges"
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$joinChallenges.challengeId",
                                        "$$challengeId"
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$joinChallenges.status",
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    as: "userStats"
                }
            },
            {
                $addFields: {
                    totalJoinedUsers: {
                        $sum: "$userStats.count"
                    },
                    completedUsers: {
                        $sum: {
                            $map: {
                                input: "$userStats",
                                as: "stat",
                                in: {
                                    $cond: [
                                        { $eq: ["$$stat._id", "completed"] },
                                        "$$stat.count",
                                        0
                                    ]
                                }
                            }
                        }
                    },
                    failedUsers: {
                        $sum: {
                            $map: {
                                input: "$userStats",
                                as: "stat",
                                in: {
                                    $cond: [
                                        { $eq: ["$$stat._id", "failed"] },
                                        "$$stat.count",
                                        0
                                    ]
                                }
                            }
                        }
                    },
                    cancelledUsers: {
                        $sum: {
                            $map: {
                                input: "$userStats",
                                as: "stat",
                                in: {
                                    $cond: [
                                        { $eq: ["$$stat._id", "cancelled"] },
                                        "$$stat.count",
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    userStats: 0
                }
            }
        ]);

    return result[0];
}

const challengeCount = async () => {
  const result = await challengeModel.aggregate([
    {
        $group: {
            _id: null,
            completed: {
                $sum: {
                    $cond: [
                        { $eq: ["$status", "closed"] },
                        1,
                        0
                    ]
                }
            },
            active: {
                $sum: {
                    $cond: [
                        { $eq: ["$status", "ongoing"] },
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
            completed: 1,
            active: 1
        }
    }
]);

  const challengeStatus = result[0] || {
    completed: 0,
    active: 0
  };

  return challengeStatus;
};
module.exports = {completeChallengeReport,challengeReport,challengeCount};