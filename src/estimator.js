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

  // Challenge 1 Complete
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
  severeImpact.infectionsByRequestedTime = calculateInfectionByTime(severeImpact.currentlyInfected);

  // Challenge 2
  const calculateSevereCases = (infectionByTime) => infectionByTime * 0.15;
  const calculateHospitalBeds = (totalBeds,
    casesByThatTime) => (totalBeds * 0.35) - casesByThatTime;

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
    return casesByThatTime * avgDailyIncomeInUSD * avgDailyIncomePopulation * lockDownDays;
  }

  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;

  impact.casesForVentilatorsByRequestedTime = impact.infectionsByRequestedTime * 0.02;
  severeImpact.casesForVentilatorsByRequestedTime = severeImpact.infectionsByRequestedTime * 0.02;

  impact.dollarsInFlight = calculateEconomyLoss(impact.infectionsByRequestedTime);
  severeImpact.dollarsInFlight = calculateEconomyLoss(severeImpact.infectionsByRequestedTime);


  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
