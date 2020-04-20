let rows = [];
let filteredRows = [];
let selectedState = null;
let selectedCounty = null;
let myChart;

document.querySelector('#counties').addEventListener('change', event => {
  selectedCounty = event.currentTarget.value;
  console.log('selected county', selectedCounty);
  filteredRows = rows.filter(r => r.state === selectedState && r.county === selectedCounty);
  draw();
});

document.querySelector('#states').addEventListener('change', event => {
  console.log('state selected', event.currentTarget.value);
  selectedState = event.currentTarget.value;
  selectedCounty = null;
  // build county options

  const stateRows = rows.filter(r => r.state === selectedState);
  const uniqueCounties = stateRows.map(s => s.county).reduce((acc, val, index, self) => {
    if (self.indexOf(val) < index) {
      return acc;
    }
    acc.push(val);
    return acc;
  }, []).sort();
  const countySelect = document.querySelector('#counties');
  // remove all of it's children
  while(countySelect.hasChildNodes()) {
    countySelect.firstChild.remove();
  }
  // add new options
  uniqueCounties.forEach(c => {
    const el = document.createElement('option');
    el.value = c;
    el.label = c;
    countySelect.appendChild(el);
  });
  // need to accumulate all counties per date
  filteredRows = stateRows.reduce((acc, val, index) => {
    const previous = acc[acc.length-1];
    if (!previous) {
      // first
      acc.push(Object.assign({}, val));
      return acc;
    } else {
      if (previous.date === val.date) {
        // same date, add countie's cases and deaths
        previous.cases = parseInt(previous.cases) + parseInt(val.cases);
        previous.deaths = parseInt(previous.deaths) + parseInt(val.deaths);
      } else {
        acc.push(Object.assign({}, val));
      }
      return acc;
    }
  }, []);
  draw();
});

// load the data
function init() {
  d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv').then(data => {
    rows = data;
    setupUI();
  });
};

function setupUI() {
  const stateSelect = document.querySelector('#states');
  const uniqueStates = rows
    .map(r => r.state)
    .reduce((acc, val, index, self) => {
      if (self.indexOf(val) < index) {
        return acc;
      }
      acc.push(val);
      return acc;
    }, []).sort();
  uniqueStates.forEach(s => {
    const el = document.createElement('option');
    el.value = s;
    el.label = s;
    stateSelect.appendChild(el);
  });
}

function draw() {
  // clean up old chart
  if (myChart) {
    myChart.destroy();
  }
  // draw the chart
  myChart = new Chart('chart', {
    type: 'line',
    data: {
      labels: filteredRows.map(f => f.date),
      datasets: [
        {
          label: 'cases',
          borderColor: '#CCCCCC',
          data: filteredRows.map(f => f.cases)
        },
        {
          label: 'deaths',
          borderColor: '#FF0000',
          data: filteredRows.map(f => f.deaths)
        }
      ]
    }
  });
}

init();
