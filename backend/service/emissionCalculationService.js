//Electricity grid Emission Factor
const getEEF = (date) =>{
   const year = new Date(date).getFullYear();
   if(year <= 2026){
        return 0.727;
   }
};


module.exports.transportationEmission = (vehicle,fuleType,distance,date)=>{
   const EEF = getEEF(date);

   if(vehicle==="2 wheeler" && fuleType==="petrol"){
       return distance * 0.1137;
   }else if(vehicle==="2 wheeler" && fuleType==="electric"){
       return distance * 0.03 * EEF;
   }else if(vehicle==="4 wheeler" && fuleType==="petrol"){
       return distance * 0.1645;
   }else if(vehicle==="4 wheeler" && fuleType==="diesel"){
       return distance * 0.1698;       
   }else if(vehicle==="4 wheeler" && fuleType==="cng"){
       return distance * 0.068;        
   }else if(vehicle==="4 wheeler" && fuleType==="electric"){
       return distance * 0.15 * EEF;        
   }else if(vehicle==="auto rickshaw" && fuleType==="petrol"){
       return distance * 0.1135;        
   }else if(vehicle==="auto rickshaw" && fuleType==="diesel"){
       return distance * 0.1322;        
   }else if(vehicle==="auto rickshaw" && fuleType==="cng"){
       return distance * 0.10768;        
   }else if(vehicle==="auto rickshaw" && fuleType==="electric"){
       return distance * 0.037 * EEF;        
   }else if(vehicle==="bus" && fuleType==="diesel"){
       return distance * 0.0152;        
   }else if(vehicle==="bus" && fuleType==="electric"){
       return distance * 0.0325 * EEF;        
   }else if(vehicle==="train" && fuleType==="electric"){
       return distance * 0.0080;        
   }
};

module.exports.electricityEmission = (consumption,date)=>{
   const EEF = getEEF(date);
   return consumption * EEF;
};

module.exports.wasteEmission = (wasteType,disposalMethod,wasteAmount)=>{
    if(wasteType==="wet waste" && disposalMethod==="composting"){
        return wasteAmount * 0.32;
    }else if(wasteType==="wet waste" && disposalMethod==="landfill"){
        return wasteAmount * 1.29;
    }else if(wasteType==="dry waste" && disposalMethod==="recycled"){
        return wasteAmount * (-0.74);
    }else if(wasteType==="dry waste" && disposalMethod==="burned"){
        return wasteAmount * 0.121;
    }else if(wasteType==="dry waste" && disposalMethod==="landfill"){
        return wasteAmount * 0.10;
    }else if(wasteType==="e waste" && disposalMethod==="recycled"){
        return wasteAmount * (-1.21);
    }else if(wasteType==="e waste" && disposalMethod==="burned"){
        return wasteAmount * 0.551;
    }else if(wasteType==="e waste" && disposalMethod==="landfill"){
        return wasteAmount * 0.022;
    }
};