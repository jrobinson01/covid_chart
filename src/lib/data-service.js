/**
 * @typedef {Object} County
 * @property {string} cases
 * @property {string} county
 * @property {string} date
 * @property {string} deaths
 * @property {string} fips
 * @property {string} state
 */

/**
 * @typedef {Object} USState
 * @property {string} date
 * @property {string} dateChecked
 * @property {string} death
 * @property {string} deathIncrease
 * @property {string} fips
 * @property {string} hash
 * @property {string} hospitalized
 * @property {string} hospitalizedCumulative
 * @proeprty {string} hospitalizedCurrently
 * @property {string} hospitalizedIncrease
 * @property {string} inIcuCumulative
 * @property {string} inIcuCurrently
 * @property {string} negative
 * @property {string} negativeIncrease
 * @property {string} onVentilatorCumulative
 * @property {string} onVentilatorCurrently
 * @property {string} pending
 * @property {string} posNeg
 * @property {string} positive
 * @property {string} positiveIncrease
 * @property {string} recovered
 * @property {string} state
 * @property {string} total
 * @property {string} totalTestResults
 * @property {string} totalTestResultsIncrease
 */

/**
 * @typedef {Object} Population
 * @property {string} BIRTHS2019
 * @property {string} COUNTY
 * @property {string} CTYNAME
 * @property {string} DEATHS2019
 * @property {string} RDEATH2019
 * @property {string} REGION
 * @property {string} STATE
 * @property {string} STNAME
 */

 /**
  * @description load population data from csv or local storage
  * @return {Promise<Array<Population>>}
  */

 async function loadPopulationData() {
  try {
    const pops = localStorage.getItem('population-data');
    if (pops) {
      return Promise.resolve(JSON.parse(pops));
    } else {
      // load and store in localStorage
      const pops = await d3.csv('/data/populations-by-county-est2019_min.csv');
      localStorage.setItem('population-data',JSON.stringify(pops));
      return pops;
    }
  } catch(e) {
    console.error('error with localStorage', e);
    // incognito most likely. just load it.
    return await d3.csv('/data/populations-by-county-est2019_min.csv');
  }
}

async function loadCsvData() {
  const counties = await d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv');
  // population data
  const pops = await loadPopulationData();
  // only states, but has way more data
  const statesData = await d3.csv('https://covidtracking.com/api/v1/states/daily.csv');

  // precalculate unique state names
  const stateNames = counties
  .map(r => r.state)
  .reduce((acc, val, index, self) => {
    if (self.indexOf(val) < index) {
      return acc;
    }
    acc.push(val);
    return acc;
  }, []).sort();

  // and counties by state
  const stateCounties = counties.reduce((acc, val, index, self) => {
    if (!acc[val.state]) {
      acc[val.state] = [];
    }
    if (!acc[val.state].find(c => c.county === val.county)) {
      acc[val.state].push(val);
    }
    return acc;
  }, {});

  return {counties, states: stateNames, stateCounties, statesData, pops};
}

export {loadCsvData};
