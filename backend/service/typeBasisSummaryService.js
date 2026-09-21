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
      totalCarbonEmission: {
        $sum: "$emission"
      },

      // 2. Transportation
      totalTransportationEmission: {
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
      totalElectricityEmission: {
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
      totalWasteEmission: {
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
      totalCarbonEmission: 1,
      totalTransportationEmission: 1,
      totalElectricityEmission: 1,
      totalWasteEmission: 1
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
            totalTransportationEmission: {
                $sum: "$emission"
            },

            // 2. Total transportation activities
            totalTransportationActivities: {
                $sum: 1
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
            totalTransportationEmission: 1,
            totalTransportationActivities: 1,

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
            totalElectricityEmission: {
                $sum: "$emission"
            },

            // 2. Total electricity consumption
            totalElectricityConsumption: {
                $sum: "$electricity.consumption"
            },

            // 3. Total electricity Activities
            totalElectricityActivities: {
                $sum: 1
            },
        }
    },

    {
        $project: {
            _id: 0,
            totalElectricityEmission: 1,
            totalElectricityConsumption: 1,
            totalElectricityActivities : 1,
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
            totalWasteEmission: {
                $sum: "$emission"
            },

            // 2. Total waste amount
            totalWasteAmount: {
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

            totalWasteEmission: 1,
            totalWasteAmount: 1,

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