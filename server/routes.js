const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1. Page 1 Drop Downs (DD1_1, DD1_2, DD1_3), States, Counties and FIPS_Names 
const communityResilienceSuggest = async function(req, res){
  connection.query(`
  SELECT DISTINCT c.State, c.County, c.FIPSCode11, Concat(c.State,' ',c.County,' ',RIGHT(c.FIPSCode11, 6)) AS Name
  FROM CTract c
  ORDER BY Name ASC
`, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    res.json([]);
  } else {
    const responseData = data.map(item => ({
      state: item.State,
      county: item.County,
      fipsCode11: item.FIPSCode11,
      name: item.Name
    }));

    const groupedData = {};

    responseData.forEach(item => {
        if (!groupedData[item.state]) {
            groupedData[item.state] = {};
        }
        if (!groupedData[item.state][item.county]) {
            groupedData[item.state][item.county] = [];
        }
        groupedData[item.state][item.county].push(item.fipsCode11);
    });

    const transformedData = Object.keys(groupedData).map(state => {
        const counties = Object.keys(groupedData[state]).map(county => {
            return { [county]: groupedData[state][county] };
        });
        return { state, county: counties };
    });
    res.json(transformedData);
  }
  });
}

// Route 2. Page 1 Form, Submits the form on Page 1 with parameters for selectedState, selectedCounty and selectedFIPSCode11
const communityResiliencePost = async function(req, res) {
  const selectedState = req.body.selectedState || 'Alabama';                    // Default to 'PA' if not provided
  const selectedCounty = req.body.selectedCounty || 'Autauga'; // Default to 'Philadelphia County' if not provided
  const selectedFIPSCode11 = req.body.selectedFIPSCode11 || '1001020100';       // Default to '37980' if not provided

  // Using parameterized query for better security
  connection.query(`
    SELECT c.SocialVulnerabilityScore, c.CommunityResilienceScore, c.RiskScore AS climateRiskScore
    FROM CTract c 
    WHERE c.State = ? AND c.County = ? AND c.FIPSCode11 = ?
  `, [selectedState, selectedCounty, selectedFIPSCode11], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data.map(item => ({
        fipsCode11: item.FIPSCode11,
        state: item.State,
        county: item.County,
        socialVulnerabilityScore: item.SocialVulnerabilityScore.toString(),
        communityResilienceScore: item.CommunityResilienceScore.toString(),
        climateRiskScore:  item.climateRiskScore.toString(),
      })));
    }
  });
};

// Route 3. Page 2 Drop Downs, State, Counties and Climate Change Impact Categories
const censusTractFilterSuggest = async function(req, res) {
  connection.query(`
    SELECT DISTINCT c.County, c.State, r.HazardType 
    FROM CTract c JOIN RiskProfile r ON c.FIPSCode11 = r.FIPSCode11 
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      const groupedData = {};

      data.forEach(item => {
        const { County, State, HazardType } = item;
        if (!groupedData[State]) {
          groupedData[State] = {};
        }
        if (!groupedData[State][County]) {
          groupedData[State][County] = new Set();
        }
        groupedData[State][County].add(HazardType);
      });

      const transformedData = Object.keys(groupedData).map(state => {
        const counties = Object.keys(groupedData[state]).map(county => ({
          [county]: Array.from(groupedData[state][county])
        }));

        return {
          state,
          county: counties
        };
      });

      res.json(transformedData);
    }
  });
};



// Route 4. Page 2 Form, Census Tract Filter Set View
// TODO - This query needs to be redone so that filtering isn't done on the front end, but we are waiting on that so we can test performance in stages. 
// TODO - Redone query will be like HW2 #9 Search Songs
const censusTractFilterPost = async function(req, res) {
  const selectedState = req.body.selectedState || 'Alabama';
  const selectedCounties = req.body.selectedCounties? [req.body.selectedCounties] : ["Autauga"];
  const selectedHazardTypes = req.body.selectedHazardTypes ? [req.body.selectedHazardTypes] : ["Avalanche"];

  const query = `
    SELECT c.FIPSCode11, c.State, c.County, s.TotalPopulation, c.RiskScore, c.SocialVulnerabilityScore,
           c.CommunityResilienceScore, s.IndividualIncomeMedian, s.SexRatio, s.PopAge_1_4, s.PopAge_5_17,
           s.PopAge_18_24, s.PopAge_25_34, s.PopAge_35_44, s.PopAge_45_54, s.PopAge_55_64, s.PopAge_65_74,
           s.PopAge_75, s.PopInc_9k, s.PopInc_10k_15k, s.PopInc_25k_35k, s.PopInc_35k_50k, s.PopInc_50k_65k,
           s.PopInc_65k_75k, s.PopInc_75k, s.PopEd_Bach, s.PopEd_GradCol, s.PopEd_High, s.PopEd_LessHigh,
           s.PopEd_SomeCol
    FROM CTract c
    JOIN SurveyResults s ON c.FIPSCode11 = s.FIPSCode11
    JOIN RiskProfile r ON c.FIPSCode11 = r.FIPSCode11
    WHERE c.State = ? AND c.County IN (?) AND r.HazardType IN (?) AND  s.SexRatio IS NOT NULL
    LIMIT 10
  `;

  connection.query(query, [selectedState, selectedCounties, selectedHazardTypes], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      const responseData = data.map(item => ({
        state: item.State,
        county: item.County,
        fipsCode11: item.FIPSCode11,
        communityResilienceScore: item.CommunityResilienceScore,
        totalPopulation: item.TotalPopulation,
        riskScore: item.RiskScore,
        socialVulnerabilityScore: item.SocialVulnerabilityScore,
        individualIncomeMedian: item.IndividualIncomeMedian,
        sexRatio: [
          {
            sex: "female",
            ratio: (1-item.SexRatio)<0?item.SexRatio:(1-item.SexRatio)
          },
          {
            sex: "male",
            ratio: item.SexRatio
          }
        ],
        Age: [
          { age: "1-4", ratio: item.PopAge_1_4 },
          { age: "5-17", ratio: item.PopAge_5_17 },
          { age: "18-24", ratio: item.PopAge_18_24 },
          { age: "25-34", ratio: item.PopAge_25_34 },
          { age: "35-44", ratio: item.PopAge_35_44 },
          { age: "45-54", ratio: item.PopAge_45_54 },
          { age: "55-64", ratio: item.PopAge_55_64 },
          { age: "65-74", ratio: item.PopAge_65_74 },
          { age: "75+", ratio: item.PopAge_75 }
        ],
        Income: [
          { type: "Under 9k", ratio: item.PopInc_9k },
          { type: "10k-15k", ratio: item.PopInc_10k_15k },
          { type: "25k-35k", ratio: item.PopInc_25k_35k },
          { type: "35k-50k", ratio: item.PopInc_35k_50k },
          { type: "50k-65k", ratio: item.PopInc_50k_65k },
          { type: "65k-75k", ratio: item.PopInc_65k_75k },
          { type: "75k+", ratio: item.PopInc_75k }
        ],
        Education: [
          { type: "Bach", ratio: item.PopEd_Bach },
          { type: "GradCol", ratio: item.PopEd_GradCol },
          { type: "High", ratio: item.PopEd_High },
          { type: "LessHigh", ratio: item.PopEd_LessHigh },
          { type: "SomeCol", ratio: item.PopEd_SomeCol }
        ]
      }));
      res.json(responseData);
    }
  });
};



// Route 5. TBL3_1, Returns a list of census tracts ordered descending by risk scores.
// Paginated
const highestRiskCensusTracts = async function(req, res) {
  const page = 1;
  const pageSize = 10;

  const query = `
    SELECT c.FIPSCode11, c.State, c.County, s.TotalPopulation, c.RiskScore, c.SocialVulnerabilityScore,
           c.CommunityResilienceScore, s.IndividualIncomeMedian, s.SexRatio, s.PopAge_1_4, s.PopAge_5_17,
           s.PopAge_18_24, s.PopAge_25_34, s.PopAge_35_44, s.PopAge_45_54, s.PopAge_55_64, s.PopAge_65_74,
           s.PopAge_75, s.PopInc_9k, s.PopInc_10k_15k, s.PopInc_25k_35k, s.PopInc_35k_50k, s.PopInc_50k_65k,
           s.PopInc_65k_75k, s.PopInc_75k, s.PopEd_Bach, s.PopEd_GradCol, s.PopEd_High, s.PopEd_LessHigh,
           s.PopEd_SomeCol
    FROM CTract c
    JOIN SurveyResults s ON c.FIPSCode11 = s.FIPSCode11
    ORDER BY c.RiskScore DESC
    LIMIT ?, ?
  `;

  connection.query(query, [(page - 1) * pageSize, pageSize], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      const responseData = data.map(item => ({
        state: item.State,
        county: item.County,
        fipsCode11: item.FIPSCode11,
        name: item.Name,
        totalPopulation: item.TotalPopulation,
        riskScore: item.RiskScore,
        socialVulnerabilityScore: item.SocialVulnerabilityScore,
        communityResilienceScore: item.CommunityResilienceScore,
        individualIncomeMedian: item.IndividualIncomeMedian,
        sexRatio: item.SexRatio,
      }));
      res.json(responseData);
    }
  });
};

const lowestRiskCensusTracts = async function(req, res) {
  const page = 1;
  const pageSize = 10;

  const query = `
    SELECT c.FIPSCode11, c.State, c.County, s.TotalPopulation, c.RiskScore, c.SocialVulnerabilityScore,
           c.CommunityResilienceScore, s.IndividualIncomeMedian, s.SexRatio, s.PopAge_1_4, s.PopAge_5_17,
           s.PopAge_18_24, s.PopAge_25_34, s.PopAge_35_44, s.PopAge_45_54, s.PopAge_55_64, s.PopAge_65_74,
           s.PopAge_75, s.PopInc_9k, s.PopInc_10k_15k, s.PopInc_25k_35k, s.PopInc_35k_50k, s.PopInc_50k_65k,
           s.PopInc_65k_75k, s.PopInc_75k, s.PopEd_Bach, s.PopEd_GradCol, s.PopEd_High, s.PopEd_LessHigh,
           s.PopEd_SomeCol
    FROM CTract c
    JOIN SurveyResults s ON c.FIPSCode11 = s.FIPSCode11
    ORDER BY c.RiskScore ASC
    LIMIT ?, ?
  `;

  connection.query(query, [(page - 1) * pageSize, pageSize], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      const responseData = data.map(item => ({
        state: item.State,
        county: item.County,
        fipsCode11: item.FIPSCode11,
        name: item.Name,
        totalPopulation: item.TotalPopulation,
        riskScore: item.RiskScore,
        socialVulnerabilityScore: item.SocialVulnerabilityScore,
        communityResilienceScore: item.CommunityResilienceScore,
        individualIncomeMedian: item.IndividualIncomeMedian,
        sexRatio: item.SexRatio,
      }));
      res.json(responseData);
    }
  });
};




// Route 6. TBL3_2, Returns a list of census tracts ordered descending by migration levels.
// Paginated
const highestMigrationCensusTracts = async function(req, res) {
  const page = 1;
  const pageSize = 10;

  const query = `
    WITH TotalMigration AS (
      SELECT SUM(TotalPopulation) AS MigrationLevel, FIPSCode11 
      FROM SurveyResults 
      WHERE MigrationStatus IN ('Moved; from abroad', 'Moved; from different state', 'Moved; from different county')
      GROUP BY FIPSCode11
    )
    SELECT c.State, c.County, t.MigrationLevel, CONCAT(c.State, ' ', c.County, ' ', RIGHT(c.FIPSCode11, 6)) AS Name
    FROM TotalMigration t
    LEFT JOIN CTract c ON c.FIPSCode11 = t.FIPSCode11 
    ORDER BY t.MigrationLevel DESC
    LIMIT ? OFFSET ?
  `;

  connection.query(query, [pageSize, (page - 1) * pageSize], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      const responseData = data.map(item => ({
        state: item.State,
        county: item.County,
        migrationLevel: item.MigrationLevel,
        name: item.Name
      }));
      res.json(responseData);
    }
  });
};

const lowestMigrationCensusTracts = async function(req, res) {
  const page = 1;
  const pageSize = 10;

  const query = `
  WITH TotalMigration AS (
    SELECT SUM(TotalPopulation) AS MigrationLevel, FIPSCode11
    FROM SurveyResults
    WHERE MigrationStatus IN ('Moved; from abroad', 'Moved; from different state', 'Moved; from different county')
    GROUP BY FIPSCode11
  )
  SELECT c.State, c.County, t.MigrationLevel, CONCAT(c.State, ' ', c.County, ' ', RIGHT(c.FIPSCode11, 6)) AS Name
  FROM TotalMigration t
  LEFT JOIN CTract c ON c.FIPSCode11 = t.FIPSCode11
  WHERE t.MigrationLevel IS NOT NULL
  ORDER BY t.MigrationLevel ASC
    LIMIT ? OFFSET ?
  `;

  connection.query(query, [pageSize, (page - 1) * pageSize], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      const responseData = data.map(item => ({
        state: item.State,
        county: item.County,
        migrationLevel: item.MigrationLevel,
        name: item.Name
      }));
      res.json(responseData);
    }
  });
};


// Route 7. TBL4_1, Average Climate Resilience Score by Population Weighted Census Tract, Grouped by State
// Paginated
const averageClimateRiskByIncome = async function(req, res) { 
  const page = 1; // Parsing the page number and defaulting to 1 if invalid
  const pageSize = 10; // Parsing the page size and defaulting to 10 if invalid
  
  connection.query(`
    SELECT State, AVG(RiskScore) AS AverageClimateRiskScore 
    FROM CTract
    WHERE RiskScore IS NOT NULL
    GROUP BY State
    ORDER BY AverageClimateRiskScore ASC
    LIMIT ?, ?
  `, [pageSize * (page - 1), pageSize], // Using placeholders for LIMIT and OFFSET to prevent SQL injection
  (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (data.length === 0) {
      res.status(404).json({ error: 'No data found' });
    } else {
      res.json(data.map(row => ({
        averageClimateRiskScore: row.AverageClimateRiskScore,
        state: row.State
      })));
    }
  });  
}


// Route 8. TBL4_2, Returns data related to average climate risk scores by income groups for all states.
// Paginated
const averageClimateRiskByState = async function(req, res) {
  const page = 1;
  const pageSize = 10;

  const query = `
    WITH Anys AS (
      SELECT FIPSCode11, TotalPopulation, PopInc_9k, PopInc_10k_15k, PopInc_15k_25k, PopInc_25k_35k, 
             PopInc_35k_50k, PopInc_50k_65k, PopInc_65k_75k, PopInc_75k
      FROM SurveyResults
      WHERE MigrationStatus = 'Any'
    ),
    FIPs_Risk AS (
      SELECT FIPSCode11, RiskScore, State FROM CTract
    )
    SELECT Anys.FIPSCode11, Anys.TotalPopulation, Anys.PopInc_9k, Anys.PopInc_10k_15k, Anys.PopInc_15k_25k, 
           Anys.PopInc_25k_35k, Anys.PopInc_35k_50k, Anys.PopInc_50k_65k, Anys.PopInc_65k_75k, Anys.PopInc_75k,
           FIPs_Risk.RiskScore, FIPs_Risk.State 
    FROM Anys 
    LEFT JOIN FIPs_Risk ON Anys.FIPSCode11 = FIPs_Risk.FIPSCode11
    LIMIT ? OFFSET ?
  `;

  connection.query(query, [pageSize, (page - 1) * pageSize], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      const responseData = data.map(item => ({
        fipsCode11: item.FIPSCode11,
        totalPopulation: item.TotalPopulation,
        popInc_9k: item.PopInc_9k,
        popInc_10k_15k: item.PopInc_10k_15k,
        popInc_15k_25k: item.PopInc_15k_25k,
        popInc_25k_35k: item.PopInc_25k_35k,
        popInc_35k_50k: item.PopInc_35k_50k,
        popInc_50k_65k: item.PopInc_50k_65k,
        popInc_65k_75k: item.PopInc_65k_75k,
        popInc_75k: item.PopInc_75k,
        riskScore: item.RiskScore,
        state: item.State
      }));
      res.json(responseData);
    }
  });
};


module.exports = {
  lowestRiskCensusTracts,
  communityResilienceSuggest,   
  communityResiliencePost,      // Takes params: selectedState, selectedCounty, selectedFIPSCode11
  censusTractFilterSuggest,
  censusTractFilterPost,        // Takes params: selectedState, selectedCounties, selectedHazardTypes
  highestRiskCensusTracts,      // Takes params: page, pageSize
  lowestMigrationCensusTracts,
  highestMigrationCensusTracts, // Takes params: page, pageSize
  averageClimateRiskByIncome,   // Takes params: page, pageSize
  averageClimateRiskByState     // Takes params: page, pageSize
}
