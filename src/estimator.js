const WEEKS = 'weeks';
const MONTHS = 'months';

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;

  // eslint-disable-next-line no-nested-ternary
  const convertTimeToDays = (et, ptype) => (ptype === WEEKS
    ? (et * 7)
    : ptype === MONTHS
      ? (et * 30)
      : et
  );
  // Challenge 1

  // Calculates 3-Day figure doubling according to time estimation
  const calcInfectedByTime = (currentlyInfected, estimatedTime, periodType) => {
    const estimatedTimeConvert = convertTimeToDays(estimatedTime, periodType);

    const estimatedInfectionsOverTime = currentlyInfected
            * (2 ** Math.floor((estimatedTimeConvert / 3)));

    return estimatedInfectionsOverTime;
  };

  let currentlyInfected = reportedCases * 10;
  const { periodType } = data;
  let infectionsByRequestedTime = calcInfectedByTime(
    currentlyInfected,
    timeToElapse,
    periodType
  );

  // Challenge 2

  let severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;
  const availableBeds = 0.35 * totalHospitalBeds;

  let hospitalBedsByRequestedTime = Math.floor(availableBeds - severeCasesByRequestedTime);
  let casesForICUByRequestedTime = Math.floor(0.05 * infectionsByRequestedTime);
  let casesForVentilatorsByRequestedTime = Math.floor(0.02 * infectionsByRequestedTime);


  // Challenge 3

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  let dollarsInFlight = Math.floor(
    ((infectionsByRequestedTime
                    * avgDailyIncomeInUSD
                    * avgDailyIncomePopulation)
                    / convertTimeToDays(timeToElapse, periodType)
    )
  );

  const impact = {
    currentlyInfected: Math.floor(currentlyInfected),
    infectionsByRequestedTime: Math.floor(infectionsByRequestedTime),
    severeCasesByRequestedTime: Math.floor(severeCasesByRequestedTime),
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };


  currentlyInfected = reportedCases * 50;
  infectionsByRequestedTime = calcInfectedByTime(currentlyInfected, timeToElapse, periodType);
  severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;
  hospitalBedsByRequestedTime = Math.floor(availableBeds - severeCasesByRequestedTime);
  casesForICUByRequestedTime = Math.floor(0.05 * infectionsByRequestedTime);
  casesForVentilatorsByRequestedTime = Math.floor(0.02 * infectionsByRequestedTime);
  dollarsInFlight = Math.floor(
    ((infectionsByRequestedTime
                    * avgDailyIncomeInUSD
                    * avgDailyIncomePopulation)
                    / convertTimeToDays(timeToElapse, periodType)
    )
  );

  const severeImpact = {
    currentlyInfected: Math.floor(currentlyInfected),
    infectionsByRequestedTime: Math.floor(infectionsByRequestedTime),
    severeCasesByRequestedTime: Math.floor(severeCasesByRequestedTime),
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };

  return { data, impact, severeImpact };
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

export default covid19ImpactEstimator;
