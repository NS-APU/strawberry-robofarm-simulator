import { analyzeHealth } from './src/lib/logic/analysisService';

console.log('Running verification...');

const result = analyzeHealth(undefined, undefined);
const metrics = result.metrics;

const keysToCheck = ['harvestSpeed', 'operability', 'maintainability', 'safety', 'durability'];
let allPassed = true;

keysToCheck.forEach((key) => {
  const metric = metrics[key];
  if (metric.status !== 'unknown') {
    console.error(`ERROR: ${key} status is ${metric.status}, expected 'unknown'`);
    allPassed = false;
  }
  if (metric.diagnosis !== '-') {
    console.error(`ERROR: ${key} diagnosis is ${metric.diagnosis}, expected '-'`);
    allPassed = false;
  }
  if (metric.action !== '-') {
    console.error(`ERROR: ${key} action is ${metric.action}, expected '-'`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('SUCCESS: All metrics have correct default values when robot data is missing.');
} else {
  console.error('FAILURE: Some metrics did not have correct default values.');
  process.exit(1);
}
