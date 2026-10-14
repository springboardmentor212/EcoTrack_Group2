const {getTransportationData,getElectricityData,getWasteData,getEmissionData} = require("../goal/goalsDurationData");

const checkNothaveEntry = async (goal,sD,eD,unit) => {
     const {category,goalType,trackingType,userId} = goal;
     let value,values;

     const startDate = new Date(
       Date.UTC(
         sD.getUTCFullYear(),
         sD.getUTCMonth(),
         sD.getUTCDate(),
         0,0,0,0
        ));

     const endDate = new Date(
        Date.UTC(
         eD.getUTCFullYear(),
         eD.getUTCMonth(),
         eD.getUTCDate(),
         23,59,59,999
        ));

     if(category==="transportation"){
        const transportationData = await getTransportationData(startDate,endDate,unit,userId);  
        if(goalType === "reduce travelling distance" || goalType === "keep travelling distance within limit"){ 
              values = transportationData.map(el => el.totalDistance);
        }else if(goalType === "use only electric vehicle"){
              values = transportationData.map(el => el.electricCount);
        }else if(goalType === "use only cng vehicle"){
              values = transportationData.map(el => el.cngCount);
        }
    }else if(category === "electricity"){
        const electricityData = await getElectricityData(startDate,endDate,userId);
        values = electricityData.map(el => el.consumption);
    }else if(category === "waste management" || category === "carbon save"){
        const wasteData = await getWasteData(startDate,endDate,unit,userId);
        if(category === "waste management"){
           values = wasteData.map(el => el.totalWasteAmount);
        }else{
           values = wasteData.map(el => el.totalCarbonSave);     
        }
    }else if(category === "carbon emission"){
        const carbonData = await getEmissionData(startDate,endDate,unit,trackingType,userId);
        values = carbonData.map(el => el.totalEmission);
    }

    value = values[0];
    if(values.length === 0 || value==-1){
        return true;
    }

    return false;
};

const checkNothaveEntryForChallenge = async (userId,challenge,sD,eD,unit) => {
     const {category,challengeType,trackingType} = challenge;
     let value,values;

     const startDate = new Date(
       Date.UTC(
         sD.getUTCFullYear(),
         sD.getUTCMonth(),
         sD.getUTCDate(),
         0,0,0,0
        ));

     const endDate = new Date(
        Date.UTC(
         eD.getUTCFullYear(),
         eD.getUTCMonth(),
         eD.getUTCDate(),
         23,59,59,999
        ));

     if(category==="transportation"){
        const transportationData = await getTransportationData(startDate,endDate,unit,userId);  
        if(challengeType === "distance limit challenge"){ 
            values = transportationData.map(el => el.totalDistance);
        }else if(challengeType === "ev travel challenge"){
            values = transportationData.map(el => el.electricCount);
        }else if(challengeType === "cng commute challenge"){
            values = transportationData.map(el => el.cngCount);
        }
    }else if(category === "electricity"){
        const electricityData = await getElectricityData(startDate,endDate,userId);
        values = electricityData.map(el => el.consumption);
    }else if(category === "waste management" || category === "carbon save"){
        const wasteData = await getWasteData(startDate,endDate,unit,userId);
        if(category === "waste management"){
           values = wasteData.map(el => el.totalWasteAmount);
        }else{
           values = wasteData.map(el => el.totalCarbonSave);     
        }
    }else if(category === "carbon emission"){
        const carbonData = await getEmissionData(startDate,endDate,unit,trackingType,userId);
        values = carbonData.map(el => el.totalEmission);
    }

    value = values[0];
    if(values.length === 0 || value==-1){
        return true;
    }

    return false;
};


module.exports = {checkNothaveEntry,checkNothaveEntryForChallenge};