require("dotenv").config();

const mongoose = require("mongoose");

const {goalModel} = require("../../model/goalModel");
const {notificationModel} = require("../../model/notificationModel");

const predefinedGoals = [
   // 1. TRANSPORTATION
    {
        title: "reduce travelling distance by 10% daily",
        category: "transportation",
        goalType: "reduce travelling distance",
        target: 10,
        unit: "%",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Transportation Goal Suggestion",
            message: "Try reducing your daily travel distance by 10% to make your travel more sustainable.",
            action: "create goal"
        }
    },
     {
        title: "reduce travelling distance by 20% weekly",
        category: "transportation",
        goalType: "reduce travelling distance",
        target: 20,
        unit: "%",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Transportation Goal Suggestion",
            message: "Try reducing your weekly travel distance by 20% to make your travel more sustainable.",
            action: "create goal"
        }
    },
     {
        title: "reduce travelling distance by 30% monthly",
        category: "transportation",
        goalType: "reduce travelling distance",
        target: 30,
        unit: "%",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Transportation Goal Suggestion",
            message: "Try reducing your monthly travel distance by 30% to make your travel more sustainable.",
            action: "create goal"
        }
    },
    {
        title: "Keep travelling distance within limit 10 km daily",
        category: "transportation",
        goalType: "keep travelling distance within limit",
        target: 10,
        unit: "km",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your Travel Within 10 km",
            message: "Try keeping your daily travel distance within 10 km.",
            action: "create goal"
        }
    },
    {
        title: "Keep travelling distance within limit 50 km weekly",
        category: "transportation",
        goalType: "keep travelling distance within limit",
        target: 50,
        unit: "km",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your Travel Within 50 km",
            message: "Try keeping your weekly travel distance within 50 km.",
            action: "create goal"
        }
    },
    {
        title: "Keep travelling distance within limit 150 km monthly",
        category: "transportation",
        goalType: "keep travelling distance within limit",
        target: 150,
        unit: "km",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your Travel Within 150 km",
            message: "Try keeping your monthly travel distance within 150 km.",
            action: "create goal"
        }
    },
    // ----- Use only electric vehicle -----

    {
        title: "Use only electric vehicle for 3 trips daily",
        category: "transportation",
        goalType: "use only electric vehicle",
        target: 3,
        unit: "trips",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Go Electric Today",
            message: "Try using an electric vehicle for at least 3 trips today.",
            action: "create goal"
        }
    },

    {
        title: "Use only electric vehicles for 20 trips weekly",
        category: "transportation",
        goalType: "use only electric vehicle",
        target: 20,
        unit: "trips",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Make This Week Electric",
            message: "Try using electric vehicles for at least 20 trips for a week.",
            action: "create goal"
        }
    },

    {
        title: "Use only electric vehicles for 70 trips monthly",
        category: "transportation",
        goalType: "use only electric vehicle",
        target: 70,
        unit: "trips",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Choose Electric Travel",
            message: "Try using electric vehicles for at least 70 trips for a month.",
            action: "create goal"
        }
    },


    // ----- Use only CNG vehicle -----

    {
        title: "Use only CNG Vehicle for 4 trips daily",
        category: "transportation",
        goalType: "use only cng vehicle",
        target: 4,
        unit: "trips",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Choose CNG Today",
            message: "Try using a CNG vehicle for at least 4 trips today.",
            action: "create goal"
        }
    },

    {
        title: "Use only CNG vehicles for 20 trips weekly",
        category: "transportation",
        goalType: "use only cng vehicle",
        target: 20,
        unit: "trips",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Make This Week CNG-Friendly",
            message: "Try using CNG vehicles for at least 20 trips for a week.",
            action: "create goal"
        }
    },

    {
        title: "Use only CNG vehicles for 70 trips monthly",
        category: "transportation",
        goalType: "use only cng vehicle",
        target: 70,
        unit: "trips",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Choose CNG for Your Travel",
            message: "Try using CNG vehicles for at least 70 trips for a month.",
            action: "create goal"
        }
    },


    // 2. ELECTRICITY
    // ----- Reduce electricity consumption -----

    {
        title: "Reduce electricity consumption by 10% monthly",
        category: "electricity",
        goalType: "reduce electricity consumption",
        target: 10,
        unit: "%",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Reduce Your Electricity Use",
            message: "Try reducing your monthly electricity consumption by 10%.",
            action: "create goal"
        }
    },


    // ----- Keep electricity consumption within limit -----

    {
        title: "Keep electricity consumption within limit 100 kWh monthly",
        category: "electricity",
        goalType: "keep electricity consumption within limit",
        target: 100,
        unit: "kWh",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Electricity Use in Check",
            message: "Try keeping your monthly electricity consumption within 100 kWh.",
            action: "create goal"
        }
    },

    // 3. WASTE MANAGEMENT
    // ----- Reduce waste generated -----

    {
        title: "Reduce waste generated by 10% daily",
        category: "waste management",
        goalType: "reduce waste generated",
        target: 10,
        unit: "%",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Reduce Your Daily Waste",
            message: "Try reducing the amount of waste you generate each day by 10%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce waste generated by 15% weekly",
        category: "waste management",
        goalType: "reduce waste generated",
        target: 15,
        unit: "%",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Reduce Your Weekly Waste",
            message: "Try reducing the amount of waste you generate each week by 15%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce waste generated by 20% monthly",
        category: "waste management",
        goalType: "reduce waste generated",
        target: 20,
        unit: "%",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Reduce Your Monthly Waste",
            message: "Try reducing the amount of waste you generate each month by 20%.",
            action: "create goal"
        }
    },


    // ----- Keep waste generation within limit -----

    {
        title: "Keep waste generation within limit 3 kg daily",
        category: "waste management",
        goalType: "keep waste generation within limit",
        target: 3,
        unit: "kg",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your Daily Waste Low",
            message: "Try keeping your daily waste generation within 3 kg.",
            action: "create goal"
        }
    },

    {
        title: "Keep waste generation within limit 15 kg weekly",
        category: "waste management",
        goalType: "keep waste generation within limit",
        target: 15,
        unit: "kg",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your Weekly Waste Low",
            message: "Try keeping your weekly waste generation within 15 kg.",
            action: "create goal"
        }
    },

    {
        title: "Keep waste generation within limit 45 kg monthly",
        category: "waste management",
        goalType: "keep waste generation within limit",
        target: 45,
        unit: "kg",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your Monthly Waste Low",
            message: "Try keeping your monthly waste generation within 45 kg.",
            action: "create goal"
        }
    },

    //4. carbon emission 
    //trackingType: All
    // ----- reduce carbon emissions -----


    {
        title: "Reducecarbon emissions by 10% daily",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "all",
        target: 10,
        unit: "%",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Reduce Your overall Carbon emission",
            message: "Try reducing your daily carbon emissions by 10%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce carbon emissions by 15% weekly",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "all",
        target: 15,
        unit: "%",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Lower Your overall Weekly Carbon Emission",
            message: "Try reducing your weekly carbon emissions by 15%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce carbon emissions by 20% monthly",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "all",
        target: 20,
        unit: "%",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Lower Your overall Monthly Carbon Emission",
            message: "Try reducing your monthly carbon emissions by 20%.",
            action: "create goal"
        }
    },


    // ----- Keep carbon emissions within limit -----

    {
        title: "Keep carbon emissions within limit 5 kg CO2 daily",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "all",
        target: 5,
        unit: "kg CO2",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your overall Carbon Emissions Low",
            message: "Try keeping your daily carbon emissions within 5 kgco2.",
            action: "create goal"
        }
    },

    {
        title: "Keep carbon emissions within limit 30 kg CO2 weekly",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "all",
        target: 30,
        unit: "kg CO2",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your Weekly Emissions Low",
            message: "Try keeping your weekly carbon emissions within 30 kg CO2.",
            action: "create goal"
        }
    },

    {
        title: "Keep carbon emissions within limit 150 kg CO2 monthly",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "all",
        target: 150,
        unit: "kg CO2",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Your Monthly Emissions Low",
            message: "Try keeping your monthly carbon emissions within 150 kg CO2.",
            action: "create goal"
        }
    },


    // trackingType: TRANSPORTATION
    // ----- Reduce -----

    {
        title: "Reduce carbon emissions from Transportation by 10% daily",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "transportation",
        target: 10,
        unit: "%",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Reduce Travel Emissions",
            message: "Try reducing your daily transportation carbon emissions by 10%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce carbon emissions from Transportation by 15% weekly",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "transportation",
        target: 15,
        unit: "%",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Lower Your Travel Emissions",
            message: "Try reducing your weekly transportation carbon emissions by 15%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce carbon emissions from Transportation by 20% monthly",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "transportation",
        target: 20,
        unit: "%",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Lower Your Monthly Travel Emissions",
            message: "Try reducing your monthly transportation carbon emissions by 20%.",
            action: "create goal"
        }
    },


    // ----- Keep within limit -----

    {
        title: "Keep carbon emissions within limit from Transportation 5 kg CO2 daily",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "transportation",
        target: 5,
        unit: "kg CO2",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Travel Emissions Low",
            message: "Try keeping your daily transportation carbon emissions within limit 5 kg CO2.",
            action: "create goal"
        }
    },

    {
        title: "Keep carbon emissions within limit from Transportation 35 kg CO2 weekly",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "transportation",
        target: 35,
        unit: "kg CO2",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Weekly Travel Emissions Low",
            message: "Try keeping your weekly transportation carbon emissions within 35 kg CO2.",
            action: "create goal"
        }
    },

    {
        title: "Keep carbon emissions within limit from Transportation 150 kg CO2 monthly",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "transportation",
        target: 150,
        unit: "kg CO2",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Monthly Travel Emissions Low",
            message: "Try keeping your monthly transportation carbon emissions within 150 kg CO2.",
            action: "create goal"
        }
    },


    // trackingType: ELECTRICITY
    // ----- Reduce -----

    {
        title: "Reduce carbon emissions from Electricity by 10% daily",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "electricity",
        target: 10,
        unit: "%",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Reduce Electricity Emissions",
            message: "Try reducing your daily carbon emissions from electricity by 10%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce carbon emissions from Electricity by 20% weekly",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "electricity",
        target: 20,
        unit: "%",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Lower Weekly Electricity Emissions",
            message: "Try reducing your weekly carbon emissions from electricity by 20%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce carbon emissions from Electricity by 15% monthly",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "electricity",
        target: 15,
        unit: "%",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Lower Monthly Electricity Emissions",
            message: "Try reducing your monthly carbon emissions from electricity by 15%.",
            action: "create goal"
        }
    },


    // ----- Keep within limit -----

    {
        title: "Keep carbon emissions within limit from Electricity 10 kg CO₂",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "electricity",
        target: 10,
        unit: "kg CO2",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Electricity Emissions Low",
            message: "Try keeping your daily carbon emissions from electricity within 10 kg CO2.",
            action: "create goal"
        }
    },

    {
        title: "Keep carbon emissions within limit from Electricity 40 kg CO₂ weekly",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "electricity",
        target: 40,
        unit: "kg CO2",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Weekly Electricity Emissions Low",
            message: "Try keeping your weekly carbon emissions from electricity within 40 kg CO2.",
            action: "create goal"
        }
    },

    {
        title: "Keep carbon emissions within limit from Electricity 120 kg CO₂ monthly",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "electricity",
        target: 120,
        unit: "kg CO2",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Monthly Electricity Emissions Low",
            message: "Try keeping your monthly carbon emissions from electricity within 120 kg CO2.",
            action: "create goal"
        }
    },

    // trackingType: WASTE MANAGEMENT
   // ----- Reduce -----

    {
        title: "Reduce carbon emissions from Waste Management by 5% daily",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "waste management",
        target: 5,
        unit: "%",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Reduce Waste Emissions",
            message: "Try reducing your daily carbon emissions from waste by 5%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce carbon emissions from Waste Management by 10% weekly",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "waste management",
        target: 10,
        unit: "%",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Lower Weekly Waste Emissions",
            message: "Try reducing your weekly carbon emissions from waste by 10%.",
            action: "create goal"
        }
    },

    {
        title: "Reduce carbon emissions from Waste Management by 20% monthly",
        category: "carbon emission",
        goalType: "reduce carbon emissions",
        trackingType: "waste management",
        target: 20,
        unit: "%",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Lower Monthly Waste Emissions",
            message: "Try reducing your monthly carbon emissions from waste by 20%.",
            action: "create goal"
        }
    },


    // ----- Keep within limit -----

    {
        title: "Keep carbon emissions within limit from Waste Management within 4 kg CO2 daily",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "waste management",
        target: 4,
        unit: "kg CO2",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Waste Emissions Low",
            message: "Try keeping your daily carbon emissions from waste within 4 kg CO2.",
            action: "create goal"
        }
    },

    {
        title: "Keep carbon emissions within limit from Waste Management within 25 kg CO2 weekly",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "waste management",
        target: 25,
        unit: "kg CO2",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Weekly Waste Emissions Low",
            message: "Try keeping your weekly carbon emissions from waste within 25 kg CO2.",
            action: "create goal"
        }
    },

    {
        title: "Keep carbon emissions within limit from Waste Management within 100 kg CO₂ monthly",
        category: "carbon emission",
        goalType: "keep carbon emissions within limit",
        trackingType: "waste management",
        target: 100,
        unit: "kg CO2",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Keep Monthly Waste Emissions Low",
            message: "Try keeping your monthly carbon emissions from waste within 100 kg CO2.",
            action: "create goal"
        }
    },

    // 5. CARBON SAVE
    // ----- Increase carbon saved -----

    {
        title: "Increase carbon saved by 5 kg co2 daily",
        category: "carbon save",
        goalType: "increase carbon saved",
        target: 5,
        unit: "kg co2",
        period: "daily",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Save More Carbon Every Day",
            message: "Try increasing the amount of carbon you save each day by 5 kg co2.",
            action: "create goal"
        }
    },

    {
        title: "Increase carbon saved by 25 kg co2 weekly",
        category: "carbon save",
        goalType: "increase carbon saved",
        target: 25,
        unit: "kg co2",
        period: "weekly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Boost Your Weekly Carbon Savings",
            message: "Try increasing the amount of carbon you save each week by 25 kg co2.",
            action: "create goal"
        }
    },

    {
        title: "Increase carbon saved by 110 kg co2 monthly",
        category: "carbon save",
        goalType: "increase carbon saved",
        target: 110,
        unit: "kg co2",
        period: "monthly",
        isSystemGoal: true,

        notification: {
            type: "goal suggestion",
            title: "Boost Your Monthly Carbon Savings",
            message: "Try increasing the amount of carbon you save each month by 110 kg co2.",
            action: "create goal"
        }
    } 
];

async function seedGoals() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB connected");

        for (const goalData of predefinedGoals) {

            const {
                notification,
                ...goalFields
            } = goalData;

            // Goal create/update
            const goal = await goalModel.findOneAndUpdate(
                {
                    title: goalFields.title
                },
                {
                    $set: goalFields
                },
                {
                    new: true,
                    upsert: true
                }
            );

            // Notification create/update
            const notificationDoc =
                await notificationModel.findOneAndUpdate(
                    {
                        relatedId: goal._id,
                        type: "goal suggestion"
                    },
                    {
                        $set: {
                            type: notification.type,
                            title: notification.title,
                            message: notification.message,
                            action: notification.action
                        }
                    },
                    {
                        new: true,
                        upsert: true
                    }
                );
        }


        const profileNotification = await notificationModel.insertOne(
            {
                title : "Complete Your Profile to Unlock Personalized Goals and challenges",
                type : "profile complition",
                message : `To help us suggest meaningful goals and challenges tailored 
                           to your interests, please complete your profile by adding your Sustainability Preferences, Environmental Interests, and Personal Goal Preferences.
                           Your personalized journey towards sustainability starts here!`,
                action : "complete profile"
            }
        );

        console.log("Seed completed successfully");

        await mongoose.disconnect();

    } catch (error) {

        console.error("Seed failed:", error);

        await mongoose.disconnect();

        process.exit(1);
    }
}

seedGoals();
