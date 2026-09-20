const mongoose = require("mongoose");
const {carbonActivityModel} = require("../model/carbonActivityModel");

const match = (type,userId,startDate,endDate) =>{
    const matchCondition = {
     userId: new mongoose.Types.ObjectId(userId),

      date: {
        $gte: startDate,
        $lt: endDate
      }
    };

    // Carbon ke case me category filter nahi lagega
     if (type !== "carbon") {
       matchCondition.category = type;
     }  
   return matchCondition; 
};


const getSummaryDaysBasis = async (type,userId,startDate,endDate) =>{
 const matchCondition = match(type,userId,startDate,endDate);
 const result = await carbonActivityModel.aggregate([

  // Dynamic filter
  {
    $match: matchCondition
  },

  // Day-wise emission
  {
    $group: {
      _id: {
        $dateTrunc: {
          date: "$date",
          unit: "day"
        }
      },

      totalEmission: {
        $sum: "$emission"
      }
    }
  },

  // Date order
  {
    $sort: {
      _id: 1
    }
  },

  // Existing days ko array me store karo
  {
    $group: {
      _id: null,

      activityDays: {
        $push: {
          date: "$_id",
          emission: "$totalEmission"
        }
      }
    }
  },

  // Month me total days
  {
    $set: {
      totalDays: {
        $dateDiff: {
          startDate: startDate,
          endDate: endDate,
          unit: "day"
        }
      }
    }
  },

  // 1, 2, 3 ... last day
  {
    $set: {
      days: {
        $range: [
          1,
          { $add: ["$totalDays", 1] }
        ]
      }
    }
  },

  // Har day ka result
  {
    $project: {
      dailyData: {
        $map: {
          input: "$days",
          as: "day",

          in: {
            label: "$$day",

            date: {
              $dateAdd: {
                startDate: startDate,
                unit: "day",
                amount: {
                  $subtract: ["$$day", 1]
                }
              }
            },

            totalEmission: {
              $let: {
                vars: {
                  currentDay: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$activityDays",
                          as: "activity",

                          cond: {
                            $eq: [
                              "$$activity.date",
                              {
                                $dateAdd: {
                                  startDate: startDate,
                                  unit: "day",
                                  amount: {
                                    $subtract: [
                                      "$$day",
                                      1
                                    ]
                                  }
                                }
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
                    "$$currentDay.emission",
                    0
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
]);

  return result;
}

const getSummaryWeekBasis = async (type,userId,startDate,endDate) => {
   const matchCondition = match(type,userId,startDate,endDate);
   const result = await carbonActivityModel.aggregate([

  // Dynamic filter
  {
    $match: matchCondition
  },

  // Week-wise emission
  {
    $group: {
      _id: {
        $dateTrunc: {
          date: "$date",
          unit: "week",
          startOfWeek: "monday"
        }
      },

      totalEmission: {
        $sum: "$emission"
      }
    }
  },

  // Date order
  {
    $sort: {
      _id: 1
    }
  },

  // Existing weeks ko array me store karo
  {
    $group: {
      _id: null,

      activityWeeks: {
        $push: {
          date: "$_id",
          emission: "$totalEmission"
        }
      }
    }
  },

  // Total weeks
  {
    $set: {
      totalWeeks: {
        $ceil: {
          $divide: [
            {
              $dateDiff: {
                startDate: startDate,
                endDate: endDate,
                unit: "day"
              }
            },
            7
          ]
        }
      }
    }
  },

  // 1, 2, 3 ... last week
  {
    $set: {
      weeks: {
        $range: [
          1,
          {
            $add: ["$totalWeeks", 1]
          }
        ]
      }
    }
  },

  // Har week ka result
  {
    $project: {
      weeklyData: {
        $map: {
          input: "$weeks",
          as: "week",

          in: {
            label: {
              $concat: [
                "Week ",
                {
                  $toString: "$$week"
                }
              ]
            },

            date: {
              $dateAdd: {
                startDate: startDate,
                unit: "week",
                amount: {
                  $subtract: ["$$week", 1]
                }
              }
            },

            totalEmission: {
              $let: {
                vars: {
                  currentWeek: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$activityWeeks",
                          as: "activity",

                          cond: {
                            $eq: [
                              "$$activity.date",
                              {
                                $dateTrunc: {
                                  date: {
                                    $dateAdd: {
                                      startDate: startDate,
                                      unit: "week",
                                      amount: {
                                        $subtract: [
                                          "$$week",
                                          1
                                        ]
                                      }
                                    }
                                  },
                                  unit: "week",
                                  startOfWeek: "monday"
                                }
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
                    "$$currentWeek.emission",
                    0
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
]);

  return result;
};


const getSummaryMonthBasis = async (type,userId,startDate,endDate) => {
   const matchCondition = match(type,userId,startDate,endDate);
   const result = await carbonActivityModel.aggregate([

    // 1. Dynamic filter
    {
        $match: matchCondition
    },

    // 2. Month-wise emission
    {
        $group: {
            _id: {
                $dateTrunc: {
                    date: "$date",
                    unit: "month"
                }
            },

            totalEmission: {
                $sum: "$emission"
            }
        }
    },

    // 3. Date order
    {
        $sort: {
            _id: 1
        }
    },

    // 4. Existing months ko array me store karo
    {
        $group: {
            _id: null,

            activityMonths: {
                $push: {
                    date: "$_id",
                    emission: "$totalEmission"
                }
            }
        }
    },

    // 5. Total months calculate karo
    {
        $set: {
            totalMonths: {
                $dateDiff: {
                    startDate: startDate,
                    endDate: endDate,
                    unit: "month"
                }
            }
        }
    },

    // 6. Month indexes create karo
    // 0 = first month
    // 1 = second month
    // 2 = third month...
    {
        $set: {
            months: {
                $range: [
                    0,
                    "$totalMonths"
                ]
            }
        }
    },

    // 7. Har month ka complete result
    {
        $project: {
            _id: 0,

            monthlyData: {
                $map: {
                    input: "$months",
                    as: "month",

                    in: {
                        $let: {
                            vars: {

                                // Current month ki date
                                monthDate: {
                                    $dateAdd: {
                                        startDate: startDate,
                                        unit: "month",
                                        amount: "$$month"
                                    }
                                }

                            },

                            in: {

                                // Month name
                                label: {
                                    $switch: {
                                        branches: [

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        1
                                                    ]
                                                },
                                                then: "Jan"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        2
                                                    ]
                                                },
                                                then: "Feb"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        3
                                                    ]
                                                },
                                                then: "Mar"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        4
                                                    ]
                                                },
                                                then: "Apr"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        5
                                                    ]
                                                },
                                                then: "May"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        6
                                                    ]
                                                },
                                                then: "Jun"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        7
                                                    ]
                                                },
                                                then: "Jul"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        8
                                                    ]
                                                },
                                                then: "Aug"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        9
                                                    ]
                                                },
                                                then: "Sep"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        10
                                                    ]
                                                },
                                                then: "Oct"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        11
                                                    ]
                                                },
                                                then: "Nov"
                                            },

                                            {
                                                case: {
                                                    $eq: [
                                                        {
                                                            $month: "$$monthDate"
                                                        },
                                                        12
                                                    ]
                                                },
                                                then: "Dec"
                                            }

                                        ],

                                        default: null
                                    }
                                },

                                // Month ki actual date
                                date: "$$monthDate",

                                // Month ka total emission
                                totalEmission: {

                                    $let: {

                                        vars: {

                                            currentMonth: {
                                                $arrayElemAt: [

                                                    {
                                                        $filter: {

                                                            input: "$activityMonths",

                                                            as: "activity",

                                                            cond: {
                                                                $eq: [

                                                                    "$$activity.date",

                                                                    {
                                                                        $dateTrunc: {
                                                                            date: "$$monthDate",
                                                                            unit: "month"
                                                                        }
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

                                            // Activity nahi hai to 0
                                            $ifNull: [
                                                "$$currentMonth.emission",
                                                0
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

    }

]);
  return result;
}

module.exports = {getSummaryDaysBasis,getSummaryWeekBasis,getSummaryMonthBasis};