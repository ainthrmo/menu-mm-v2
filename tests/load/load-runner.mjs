import http from 'http';
import { performance } from 'perf_hooks';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function makeRequest(urlPath, options = {}) {
  return new Promise((resolve) => {
    const url = new URL(urlPath, BASE_URL);
    const start = performance.now();
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 10000,
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = performance.now() - start;
        resolve({
          statusCode: res.statusCode,
          duration,
          headers: res.headers,
          bodyLength: data.length,
          error: null,
        });
      });
    });

    req.on('error', (err) => {
      const duration = performance.now() - start;
      resolve({
        statusCode: 0,
        duration,
        headers: {},
        bodyLength: 0,
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const duration = performance.now() - start;
      resolve({
        statusCode: 408,
        duration,
        headers: {},
        bodyLength: 0,
        error: 'Timeout',
      });
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function calculatePercentiles(durations) {
  if (!durations.length) return { p50: 0, p90: 0, p95: 0, p99: 0, avg: 0, min: 0, max: 0 };
  const sorted = [...durations].sort((a, b) => a - b);
  const getP = (p) => sorted[Math.floor(sorted.length * (p / 100))] || sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  return {
    p50: Math.round(getP(50) * 10) / 10,
    p90: Math.round(getP(90) * 10) / 10,
    p95: Math.round(getP(95) * 10) / 10,
    p99: Math.round(getP(99) * 10) / 10,
    avg: Math.round((sum / sorted.length) * 10) / 10,
    min: Math.round(sorted[0] * 10) / 10,
    max: Math.round(sorted[sorted.length - 1] * 10) / 10,
  };
}

async function runVirtualUser(iterations, scenarioFn, thinkTimeMs = 20) {
  const results = [];
  for (let i = 0; i < iterations; i++) {
    const res = await scenarioFn(i);
    results.push(...res);
    if (thinkTimeMs > 0) {
      await new Promise((r) => setTimeout(r, thinkTimeMs));
    }
  }
  return results;
}

export async function runLoadTest(concurrency, totalIterationsPerUser, scenarioFn, thinkTimeMs = 20) {
  const start = performance.now();
  const userPromises = [];
  for (let u = 0; u < concurrency; u++) {
    userPromises.push(runVirtualUser(totalIterationsPerUser, scenarioFn, thinkTimeMs));
  }
  const allUserResults = await Promise.all(userPromises);
  const totalDuration = performance.now() - start;
  const flatResults = allUserResults.flat();

  const durations = flatResults.map((r) => r.duration);
  const errors = flatResults.filter((r) => r.statusCode >= 500 || r.statusCode === 0 || r.error);
  const statusCodes = {};
  for (const r of flatResults) {
    statusCodes[r.statusCode] = (statusCodes[r.statusCode] || 0) + 1;
  }

  const percentiles = calculatePercentiles(durations);
  const errorRate = ((errors.length / flatResults.length) * 100).toFixed(2);
  const rps = ((flatResults.length / (totalDuration / 1000))).toFixed(1);

  return {
    concurrency,
    totalRequests: flatResults.length,
    totalDurationMs: Math.round(totalDuration),
    rps: Number(rps),
    errorRate: Number(errorRate),
    errorsCount: errors.length,
    statusCodes,
    percentiles,
  };
}

export async function scenarioPublicMenu() {
  const res = await makeRequest('/menu?demo=true');
  return [res];
}

export async function scenarioCategorySwitching() {
  const categories = [
    'Popular Specials',
    'Traditional Salads',
    'Main Dishes & Curries',
    'Noodles & Soups',
    'Drinks & Desserts',
  ];
  const results = [];
  results.push(await makeRequest('/menu?demo=true'));
  for (const cat of categories) {
    const slug = encodeURIComponent(cat);
    results.push(await makeRequest(`/menu/${slug}?demo=true`));
  }
  return results;
}

export async function scenarioFailureTests() {
  const tests = [
    {
      name: 'Invalid restaurant ID (Not Found UI)',
      path: '/menu?restaurantId=00000000-0000-0000-0000-000000000000',
      expectedStatus: 200,
    },
    {
      name: 'Non-existent category',
      path: '/menu/NonExistentCategory123?demo=true',
      expectedStatus: 200,
    },
    {
      name: 'Unauthenticated AI parser access',
      path: '/api/parse-menu',
      method: 'POST',
      body: 'mock',
      expectedStatus: 401,
    },
    {
      name: 'Protected route without session',
      path: '/protected',
      expectedStatus: 307,
    },
    {
      name: 'Admin route without session',
      path: '/admin',
      expectedStatus: 307,
    },
    {
      name: 'Leads API submission',
      path: '/api/leads',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurantName: 'Test Load Bistro',
        contactName: 'Tester',
        phone: '0912345678',
        city: 'Yangon',
      }),
      expectedStatus: 200,
    },
  ];

  const results = [];
  for (const t of tests) {
    const res = await makeRequest(t.path, {
      method: t.method || 'GET',
      headers: t.headers || {},
      body: t.body,
    });
    results.push({
      testName: t.name,
      path: t.path,
      statusCode: res.statusCode,
      expectedStatus: t.expectedStatus,
      duration: Math.round(res.duration * 10) / 10,
      passed: res.statusCode === t.expectedStatus || (t.expectedStatus === 307 && [302, 303, 307, 308].includes(res.statusCode)),
    });
  }
  return results;
}

if (process.argv[1]?.endsWith('load-runner.mjs')) {
  console.log('--- RUNNING MOSSQR PRODUCTION LOAD & RELIABILITY TEST SUITE ---');
  console.log(`Target: ${BASE_URL}\n`);

  async function main() {
    console.log('=== TEST 1: FAILURE INJECTIONS & ACCESS GUARDS ===');
    const failureResults = await scenarioFailureTests();
    console.table(failureResults);

    console.log('\n=== TEST 2: PUBLIC MENU STAGED CONCURRENCY TIERS ===');
    const concurrencyTiers = [10, 25, 50, 100];
    const tierResults = [];

    for (const users of concurrencyTiers) {
      process.stdout.write(`Executing Tier: ${users} concurrent users (5 iterations/user)... `);
      const res = await runLoadTest(users, 5, scenarioPublicMenu, 15);
      tierResults.push({
        'Users': users,
        'Total Req': res.totalRequests,
        'RPS': res.rps,
        'p50 (ms)': res.percentiles.p50,
        'p95 (ms)': res.percentiles.p95,
        'p99 (ms)': res.percentiles.p99,
        'Error Rate (%)': res.errorRate,
        'Status Codes': JSON.stringify(res.statusCodes),
      });
      console.log('DONE');
    }
    console.table(tierResults);

    console.log('\n=== TEST 3: TRAFFIC SPIKE & RECOVERY TEST ===');
    console.log('Step 1: Baseline 5 users...');
    const spike1 = await runLoadTest(5, 5, scenarioPublicMenu, 10);
    console.log(`Baseline: p50=${spike1.percentiles.p50}ms, p95=${spike1.percentiles.p95}ms, error=${spike1.errorRate}%`);

    console.log('Step 2: Spike to 50 concurrent users...');
    const spike2 = await runLoadTest(50, 5, scenarioPublicMenu, 5);
    console.log(`Peak Spike: p50=${spike2.percentiles.p50}ms, p95=${spike2.percentiles.p95}ms, error=${spike2.errorRate}%`);

    console.log('Step 3: Recovery back to 5 users...');
    const spike3 = await runLoadTest(5, 5, scenarioPublicMenu, 10);
    console.log(`Post-Spike Recovery: p50=${spike3.percentiles.p50}ms, p95=${spike3.percentiles.p95}ms, error=${spike3.errorRate}%`);

    console.log('\n=== TEST 4: CATEGORY SWITCHING LATENCY & NETWORK DENSITY ===');
    const catRes = await runLoadTest(15, 3, scenarioCategorySwitching, 20);
    console.log(`Category switching under 15 concurrent users:`);
    console.log(`Total Requests: ${catRes.totalRequests}, RPS: ${catRes.rps}, p50=${catRes.percentiles.p50}ms, p95=${catRes.percentiles.p95}ms, Error Rate=${catRes.errorRate}%`);
  }

  main().catch(console.error);
}
