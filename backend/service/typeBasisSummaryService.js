const mongoose = require("mongoose");
const {carbonActivityModel} = require("../model/carbonActivityModel");

const carbonTypeSummary = async (startDate,endDate,userId) => {
    const typeSummary = await carbonActivityModel.aggregate([
  // startDate aur endDate ke beech ki activities
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),

      date: {
        $gte: startDate,
        $lt: endDate

      }
    }
  },

  // 4 types ke emission calculate karo
  {
    $group: {
      _id: null,

      // 1. All activities
      emission: {
        $sum: "$emission"
      },

      // 2. Transportation
      transportationEmission: {
        $sum: {
          $cond: [
            {
              $eq: ["$category", "transportation"]
            },
            "$emission",
            0
          ]
        }
      },

      // 3. Electricity
      electricityEmission: {
        $sum: {
          $cond: [
            {
              $eq: ["$category", "electricity"]
            },
            "$emission",
            0
          ]
        }
      },

      // 4. Waste
      wasteEmission: {
        $sum: {
          $cond: [
            {
              $eq: ["$category", "waste"]
            },
            "$emission",
            0
          ]
        }
      }
    }
  },

  // _id remove
  {
    $project: {
      _id: 0,
      emission: 1,
      transportationEmission: 1,
      electricityEmission: 1,
      wasteEmission: 1
    }
  }
]);

  return typeSummary;
};


const transportationTypeSummary = async (startDate,endDate,userId) =>{
   const typeSummary = await carbonActivityModel.aggregate([
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId),
            category: "transportation",
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }
    },

    {
        $group: {
            _id: null,

            // 1. Total transportation carbon emission
            emission: {
                $sum: "$emission"
            },

            // 2. Total transportation activities
            distance: {
                $sum: "$transportation.distance"
            },

            // Store all transport modes
            transportModes: {
                $push: "$transportation.transportMode"
            },

            // Store all fuel types
            fuelTypes: {
                $push: "$transportation.fuelType"
            }
        }
    },

    {
        $project: {
            _id: 0,
            emission: 1,
            distance: 1,

            // 3. Most used transportation mode
            mostUsedTransportMode: {
                $let: {
                    vars: {
                        modeCounts: {
                            $map: {
                                input: {
                                    $setUnion: ["$transportModes", []]
                                },
                                as: "mode",
                                in: {
                                    mode: "$$mode",
                                    count: {
                                        $size: {
                                            $filter: {
                                                input: "$transportModes",
                                                as: "m",
                                                cond: {
                                                    $eq: ["$$m", "$$mode"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    in: {
                        $arrayElemAt: [
                            {
                                $sortArray: {
                                    input: "$$modeCounts",
                                    sortBy: { count: -1 }
                                }
                            },
                            0
                        ]
                    }
                }
            },

            // 4. Most used fuel type
            mostUsedFuelType: {
                $let: {
                    vars: {
                        fuelCounts: {
                            $map: {
                                input: {
                                    $setUnion: ["$fuelTypes", []]
                                },
                                as: "fuel",
                                in: {
                                    fuel: "$$fuel",
                                    count: {
                                        $size: {
                                            $filter: {
                                                input: "$fuelTypes",
                                                as: "f",
                                                cond: {
                                                    $eq: ["$$f", "$$fuel"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    in: {
                        $arrayElemAt: [
                            {
                                $sortArray: {
                                    input: "$$fuelCounts",
                                    sortBy: { count: -1 }
                                }
                            },
                            0
                        ]
                    }
                }
            }
        }
    }
]);

  return typeSummary;
};

const electricityTypeSummary = async (startDate,endDate,userId) => {
    const typeSummary = await carbonActivityModel.aggregate([
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId),
            category: "electricity",
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }
    },

    {
        $group: {
            _id: null,

            // 1. Total electricity carbon emission
            emission: {
                $sum: "$emission"
            },

            // 2. Total electricity consumption
            consumption: {
                $sum: "$electricity.consumption"
            },

            // 3. Total electricity Activities
            entries: {
                $sum: 1
            },
        }
    },

    {
        $project: {
            _id: 0,
            emission: 1,
            consumption: 1,
            entries : 1,
        }
    }
]);

 return typeSummary;
}

const wasteTypeSummary = async(startDate,endDate,userId) => {
  const typeSummary = await carbonActivityModel.aggregate([
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId),
            category: "waste",
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }
    },

    {
        $group: {
            _id: null,

            // 1. Total waste carbon emission
            emission: {
                $sum: "$emission"
            },

            carbonSave : {
                $sum : "$waste.carbonSave"
            },

            // 3. Total waste amount
            wasteAmount: {
                $sum: "$waste.wasteAmount"
            },

            // Store all waste types
            wasteTypes: {
                $push: "$waste.wasteType"
            },

            // Store all disposal methods
            disposalMethods: {
                $push: "$waste.disposalMethod"
            }
        }
    },

    {
        $project: {
            _id: 0,

            emission: 1,
            carbonSave : 1,
            wasteAmount: 1,

            // 3. Most used waste type
            mostUsedWasteType: {
                $let: {
                    vars: {
                        wasteTypeCounts: {
                            $map: {
                                input: {
                                    $setUnion: ["$wasteTypes", []]
                                },
                                as: "type",
                                in: {
                                    type: "$$type",
                                    count: {
                                        $size: {
                                            $filter: {
                                                input: "$wasteTypes",
                                                as: "t",
                                                cond: {
                                                    $eq: ["$$t", "$$type"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    in: {
                        $arrayElemAt: [
                            {
                                $sortArray: {
                                    input: "$$wasteTypeCounts",
                                    sortBy: { count: -1 }
                                }
                            },
                            0
                        ]
                    }
                }
            },

            // 4. Most used disposal method
            mostUsedDisposalMethod: {
                $let: {
                    vars: {
                        disposalMethodCounts: {
                            $map: {
                                input: {
                                    $setUnion: ["$disposalMethods", []]
                                },
                                as: "method",
                                in: {
                                    method: "$$method",
                                    count: {
                                        $size: {
                                            $filter: {
                                                input: "$disposalMethods",
                                                as: "m",
                                                cond: {
                                                    $eq: ["$$m", "$$method"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    in: {
                        $arrayElemAt: [
                            {
                                $sortArray: {
                                    input: "$$disposalMethodCounts",
                                    sortBy: { count: -1 }
                                }
                            },
                            0
                        ]
                    }
                }
            }
        }
    }
]);

  return typeSummary;
}

module.exports = {carbonTypeSummary,transportationTypeSummary,electricityTypeSummary,wasteTypeSummary};