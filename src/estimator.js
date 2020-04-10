const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds,
    region
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const impact = {};
  const severeImpact = {};

  // Challenge 1
  const calculateLockDownDays = () => {
    switch (periodType) {
      case 'months':
        return timeToElapse * 30;
      case 'weeks':
        return timeToElapse * 7;
      default:
        return timeToElapse;
    }
  };

  const lockDownDays = calculateLockDownDays();
  const factor = Math.floor(lockDownDays / 3);

  const calculateInfectionByTime = (infected) => infected * (2 ** factor);

  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  impact.infectionsByRequestedTime = calculateInfectionByTime(impact.currentlyInfected);
  severeImpact.infectionsByRequestedTime = calculateInfectionByTime(
    severeImpact.currentlyInfected
  );

  // Challenge 2
  const calculateSevereCases = (infectionByTime) => infectionByTime * 0.15;
  const calculateHospitalBeds = (totalBeds,
    casesByThatTime) => Math.floor((totalBeds * 0.35) - casesByThatTime);

  impact.severeCasesByRequestedTime = calculateSevereCases(impact.infectionsByRequestedTime);
  severeImpact.severeCasesByRequestedTime = calculateSevereCases(
    severeImpact.infectionsByRequestedTime
  );

  impact.hospitalBedsByRequestedTime = calculateHospitalBeds(totalHospitalBeds,
    impact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = calculateHospitalBeds(totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime);

  // Challenge 3
  function calculateEconomyLoss(casesByThatTime) {
    return Math.floor(
      (casesByThatTime * avgDailyIncomeInUSD * avgDailyIncomePopulation) / lockDownDays
    );
  }

  impact.casesForICUByRequestedTime = Math
    .floor(impact.infectionsByRequestedTime * 0.05);
  severeImpact.casesForICUByRequestedTime = Math
    .floor(severeImpact.infectionsByRequestedTime * 0.05);

  impact.casesForVentilatorsByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.02);
  severeImpact.casesForVentilatorsByRequestedTime = Math
    .floor(severeImpact.infectionsByRequestedTime * 0.02);

  impact.dollarsInFlight = calculateEconomyLoss(impact.infectionsByRequestedTime);
  severeImpact.dollarsInFlight = calculateEconomyLoss(severeImpact.infectionsByRequestedTime);


  return {
    data,
    impact,
    severeImpact
  };
};

// const data = {
//     region: {
//         name: 'Africa',
//         avgAge: 19.7,
//         avgDailyIncomeInUSD: 5,
//         avgDailyIncomePopulation: 0.71
//     },
//     periodType: 'days',
//     timeToElapse: 60,
//     reportedCases: 674,
//     population: 66622705,
//     totalHospitalBeds: 1380614
// };
// const data1 = {
//     region: {
//         name: 'Africa',
//         avgAge: 19.7,
//         avgDailyIncomeInUSD: 5,
//         avgDailyIncomePopulation: 0.71
//     },
//     periodType: 'weeks',
//     timeToElapse: 8.571428571,
//     reportedCases: 674,
//     population: 66622705,
//     totalHospitalBeds: 1380614
// };
// const data2 = {
//     region: {
//         name: 'Africa',
//         avgAge: 19.7,
//         avgDailyIncomeInUSD: 5,
//         avgDailyIncomePopulation: 0.71
//     },
//     periodType: 'months',
//     timeToElapse: 0.35,
//     reportedCases: 674,
//     population: 66622705,
//     totalHospitalBeds: 1380614
// };

// console.log(covid19ImpactEstimator(data));
// console.log(covid19ImpactEstimator(data1));
// console.log(covid19ImpactEstimator(data2));


// Comment this and uncomment the above comments for local testing
export default covid19ImpactEstimator;
