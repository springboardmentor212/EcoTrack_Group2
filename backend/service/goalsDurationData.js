const mongoose = require("mongoose");
const {carbonActivityModel} = require("../model/carbonActivityModel");

const getTransportationData = async(startDate,endDate,period,userId) => {
  const result = await carbonActivityModel.aggregate([
    // 1. Filter user's transportation activities
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId),
            category: "transportation",
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }
    },

    // 2. Group according to day / week / month
    {
        $group: {
            _id: {
                $dateTrunc: {
                    date: "$date",
                    unit: period,
                    startOfWeek: "monday"
                }
            },

            totalDistance: {
                $sum: "$transportation.distance"
            },

            cngCount: {
                $sum: {
                    $cond: [
                        {
                            $eq: [
                                "$transportation.fuelType",
                                "cng"
                            ]
                        },
                        1,
                        0
                    ]
                }
            },

            electricCount: {
                $sum: {
                    $cond: [
                        {
                            $eq: [
                                "$transportation.fuelType",
                                "electric"
                            ]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },

    // 3. Store all existing grouped data in one array
    {
        $group: {
            _id: null,
            existing: {
                $push: "$$ROOT"
            }
        }
    },

    // 4. Generate every required day/week/month
    {
        $project: {
            data: {
                $map: {

                    // Number of periods
                    input: {
                        $range: [
                            0,
                            {
                                $add: [
                                    {
                                        $dateDiff: {

                                            // Start of first period
                                            startDate: {
                                                $dateTrunc: {
                                                    date: startDate,
                                                    unit: period,
                                                    startOfWeek: "monday"
                                                }
                                            },

                                            // Start of last period
                                            endDate: {
                                                $dateTrunc: {
                                                    date: endDate,
                                                    unit: period,
                                                    startOfWeek: "monday"
                                                }
                                            },

                                            unit: period
                                        }
                                    },
                                    1
                                ]
                            }
                        ]
                    },

                    as: "index",

                    in: {
                        $let: {
                            vars: {

                                // Current day/week/month
                                currentDate: {
                                    $dateAdd: {
                                        startDate: {
                                            $dateTrunc: {
                                                date: startDate,
                                                unit: period,
                                                startOfWeek: "monday"
                                            }
                                        },

                                        unit: period,

                                        amount: "$$index"
                                    }
                                }
                            },

                            in: {
                                $let: {
                                    vars: {

                                        // Find data for current period
                                        currentData: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$existing",

                                                        as: "item",

                                                        cond: {
                                                            $eq: [
                                                                "$$item._id",
                                                                "$$currentDate"
                                                            ]
                                                        }
                                                    }
                                                },

                                                0
                                            ]
                                        }
                                    },

                                    in: {

                                        date: "$$currentDate",

                                        totalDistance: {
                                            $ifNull: [
                                                "$$currentData.totalDistance",
                                                -1
                                            ]
                                        },

                                        cngCount: {
                                            $ifNull: [
                                                "$$currentData.cngCount",
                                                -1
                                            ]
                                        },

                                        electricCount: {
                                            $ifNull: [
                                                "$$currentData.electricCount",
                                                -1
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // 5. Convert array elements into documents
    {
        $unwind: "$data"
    },

    // 6. Make data the root document
    {
        $replaceRoot: {
            newRoot: "$data"
        },
    },

    // 7. Sort chronologically
    {
        $sort: {
            date: 1
        }
    }
]);

  return result;
};

const getElectricityData = async(startDate,endDate,userId) => {
    const result = await carbonActivityModel.aggregate([

    // 1. Date range + electricity filter
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId),
            category: "electricity",
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }
    },

    // 2. Month ke according consumption
    {
        $group: {
            _id: {
                year: { $year: "$date" },
                month: { $month: "$date" }
            },

            consumption: {
                $sum: "$electricity.consumption"
            }
        }
    },

    // 3. Existing data ko array me convert karo
    {
        $group: {
            _id: null,

            data: {
                $push: {
                    year: "$_id.year",
                    month: "$_id.month",
                    consumption: "$consumption"
                }
            }
        }
    },

    // 4. StartDate se EndDate tak months generate karo
    {
        $project: {
            data: {
                $map: {
                    input: {
                        $range: [
                            0,
                            {
                                $add: [
                                    {
                                        $dateDiff: {
                                            startDate: startDate,
                                            endDate: endDate,
                                            unit: "month"
                                        }
                                    },
                                    1
                                ]
                            }
                        ]
                    },

                    as: "index",

                    in: {
                        $let: {
                            vars: {
                                currentMonth: {
                                    $dateAdd: {
                                        startDate: startDate,
                                        unit: "month",
                                        amount: "$$index"
                                    }
                                }
                            },

                            in: {
                                year: {
                                    $year: "$$currentMonth"
                                },

                                month: {
                                    $month: "$$currentMonth"
                                },

                                consumption: {
                                    $let: {
                                        vars: {
                                            matchedData: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$data",
                                                            as: "item",

                                                            cond: {
                                                                $and: [
                                                                    {
                                                                        $eq: [
                                                                            "$$item.year",
                                                                            {
                                                                                $year: "$$currentMonth"
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        $eq: [
                                                                            "$$item.month",
                                                                            {
                                                                                $month: "$$currentMonth"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        },

                                        in: {
                                            $ifNull: [
                                                "$$matchedData.consumption",
                                                -1
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // 5. Array ko separate documents me convert karo
    {
        $unwind: "$data"
    },

    {
        $replaceRoot: {
            newRoot: "$data"
        }
    },

    // 6. Month order
    {
        $sort: {
            year: 1,
            month: 1
        }
    }
]);

 return result;
}

const getWasteData = async (startDate, endDate,period, userId) => {
    const result = await carbonActivityModel.aggregate([

        // 1. Filter waste activities
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                category: "waste",
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },

        // 2. Group according to day / week / month
        {
            $group: {
                _id: {
                    $dateTrunc: {
                        date: "$date",
                        unit: period,
                        startOfWeek: "monday"
                    }
                },

                totalWasteAmount: {
                    $sum: "$waste.wasteAmount"
                },

                totalCarbonSave: {
                    $sum: "$waste.carbonSave"
                }
            }
        },

        // 3. Store existing grouped data
        {
            $group: {
                _id: null,
                existing: {
                    $push: "$$ROOT"
                }
            }
        },

        // 4. Generate every required period
        {
            $project: {
                data: {
                    $map: {

                        input: {
                            $range: [
                                0,
                                {
                                    $add: [
                                        {
                                            $dateDiff: {
                                                startDate: {
                                                    $dateTrunc: {
                                                        date: startDate,
                                                        unit: period,
                                                        startOfWeek: "monday"
                                                    }
                                                },
                                                endDate: {
                                                    $dateTrunc: {
                                                        date: endDate,
                                                        unit: period,
                                                        startOfWeek: "monday"
                                                    }
                                                },
                                                unit: period
                                            }
                                        },
                                        1
                                    ]
                                }
                            ]
                        },

                        as: "index",

                        in: {
                            $let: {
                                vars: {

                                    currentDate: {
                                        $dateAdd: {
                                            startDate: {
                                                $dateTrunc: {
                                                    date: startDate,
                                                    unit: period,
                                                    startOfWeek: "monday"
                                                }
                                            },

                                            unit: period,
                                            amount: "$$index"
                                        }
                                    }

                                },

                                in: {
                                    $let: {
                                        vars: {

                                            currentData: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$existing",
                                                            as: "item",

                                                            cond: {
                                                                $eq: [
                                                                    "$$item._id",
                                                                    "$$currentDate"
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }

                                        },

                                        in: {

                                            date: "$$currentDate",

                                            totalWasteAmount: {
                                                $ifNull: [
                                                    "$$currentData.totalWasteAmount",
                                                    -1
                                                ]
                                            },

                                            totalCarbonSave: {
                                                $ifNull: [
                                                    "$$currentData.totalCarbonSave",
                                                    -1
                                                ]
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        // 5. Convert array into documents
        {
            $unwind: "$data"
        },

        // 6. Make data root
        {
            $replaceRoot: {
                newRoot: "$data"
            }
        },

        // 7. Sort
        {
            $sort: {
                date: 1
            }
        }

    ]);

    return result;
};

const match = (trackingType,userId,startDate,endDate) =>{
    const matchCondition = {
     userId: new mongoose.Types.ObjectId(userId),

      date: {
        $gte: startDate,
        $lt: endDate
      }
    };

    // Carbon ke case me category filter nahi lagega
     if(trackingType !== "all" && trackingType !== "waste management") {
       matchCondition.category = trackingType;
     }else if(trackingType === "waste management"){
       matchCondition.category = "waste";
     } 

   return matchCondition; 
};

const getEmissionData = async (startDate, endDate, period,trackingType, userId) => {
    const matchCondition = match(trackingType,userId,startDate,endDate);
    const result = await carbonActivityModel.aggregate([
    // 1. Filter user's transportation activities
    {
        $match: matchCondition
    },

    // 2. Group according to day / week / month
    {
        $group: {
            _id: {
                $dateTrunc: {
                    date: "$date",
                    unit: period,
                    startOfWeek: "monday"
                }
            },

            totalEmission: {
                $sum: "$emission"
            },

        }
    },

    // 3. Store all existing grouped data in one array
    {
        $group: {
            _id: null,
            existing: {
                $push: "$$ROOT"
            }
        }
    },

    // 4. Generate every required day/week/month
    {
        $project: {
            data: {
                $map: {

                    // Number of periods
                    input: {
                        $range: [
                            0,
                            {
                                $add: [
                                    {
                                        $dateDiff: {

                                            // Start of first period
                                            startDate: {
                                                $dateTrunc: {
                                                    date: startDate,
                                                    unit: period,
                                                    startOfWeek: "monday"
                                                }
                                            },

                                            // Start of last period
                                            endDate: {
                                                $dateTrunc: {
                                                    date: endDate,
                                                    unit: period,
                                                    startOfWeek: "monday"
                                                }
                                            },

                                            unit: period
                                        }
                                    },
                                    1
                                ]
                            }
                        ]
                    },

                    as: "index",

                    in: {
                        $let: {
                            vars: {

                                // Current day/week/month
                                currentDate: {
                                    $dateAdd: {
                                        startDate: {
                                            $dateTrunc: {
                                                date: startDate,
                                                unit: period,
                                                startOfWeek: "monday"
                                            }
                                        },

                                        unit: period,

                                        amount: "$$index"
                                    }
                                }
                            },

                            in: {
                                $let: {
                                    vars: {

                                        // Find data for current period
                                        currentData: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$existing",

                                                        as: "item",

                                                        cond: {
                                                            $eq: [
                                                                "$$item._id",
                                                                "$$currentDate"
                                                            ]
                                                        }
                                                    }
                                                },

                                                0
                                            ]
                                        }
                                    },

                                    in: {

                                        date: "$$currentDate",

                                        totalEmission: {
                                            $ifNull: [
                                                "$$currentData.totalEmission",
                                                -1
                                            ]
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // 5. Convert array elements into documents
    {
        $unwind: "$data"
    },

    // 6. Make data the root document
    {
        $replaceRoot: {
            newRoot: "$data"
        },
    },

    // 7. Sort chronologically
    {
        $sort: {
            date: 1
        }
    }
]);

 return result;
}
module.exports = {getTransportationData,getElectricityData,getWasteData,getEmissionData};