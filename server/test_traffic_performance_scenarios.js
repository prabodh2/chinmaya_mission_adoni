import http from 'http';

const BASE_URL = 'http://localhost:5000';

// Real-world endpoints hit during visitor browsing journeys
const ENDPOINTS = [
  { name: 'Health & Status', path: '/api/health', method: 'GET' },
  { name: 'Home Content', path: '/api/content/website/chinmaya/page/home', method: 'GET' },
  { name: 'About Content', path: '/api/content/website/chinmaya/page/about', method: 'GET' },
  { name: 'Who We Are Content', path: '/api/content/website/chinmaya/page/who-are-we', method: 'GET' },
  { name: 'Temple Content', path: '/api/content/website/chinmaya/page/temple', method: 'GET' },
  { name: 'Activities List', path: '/api/activities', method: 'GET' },
  { name: 'Banners List', path: '/api/banners', method: 'GET' },
  { name: 'Public Thoughts', path: '/api/thoughts', method: 'GET' },
  { name: 'Marathon Content', path: '/api/content/website/marathon/page/registration', method: 'GET' },
  { name: 'Event Config', path: '/api/events/config', method: 'GET' },
  { name: 'FAQs List', path: '/api/faqs', method: 'GET' },
  { name: 'Marathon Counts', path: '/api/registrations/counts', method: 'GET' },
  { name: 'Marathon Summary', path: '/api/registrations/summary', method: 'GET' },
];

const makeRequest = (path, method = 'GET') => {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    const url = new URL(path, BASE_URL);

    const req = http.request(
      url,
      {
        method,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PerformanceAuditClient/1.0',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          const endTime = process.hrtime.bigint();
          const latencyMs = Number(endTime - startTime) / 1_000_000;
          resolve({
            statusCode: res.statusCode,
            latencyMs,
            success: res.statusCode >= 200 && res.statusCode < 400,
            contentLength: body.length,
          });
        });
      }
    );

    req.on('error', (err) => {
      const endTime = process.hrtime.bigint();
      const latencyMs = Number(endTime - startTime) / 1_000_000;
      resolve({
        statusCode: 0,
        latencyMs,
        success: false,
        error: err.message,
      });
    });

    req.end();
  });
};

const calculateStats = (latencies) => {
  if (latencies.length === 0) return { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const avg = sum / sorted.length;
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  return {
    min: Number(sorted[0].toFixed(2)),
    max: Number(sorted[sorted.length - 1].toFixed(2)),
    avg: Number(avg.toFixed(2)),
    p50: Number(p50.toFixed(2)),
    p95: Number(p95.toFixed(2)),
    p99: Number(p99.toFixed(2)),
  };
};

const runBatch = async (requests) => {
  return Promise.all(requests.map((r) => makeRequest(r.path, r.method)));
};

const executeScenario = async (title, totalRequests, concurrency, delayBetweenBatchesMs = 50) => {
  console.log(`\n======================================================`);
  console.log(`🚀 RUNNING: ${title}`);
  console.log(`📊 Parameters: ${totalRequests} total requests | Concurrency: ${concurrency} simultaneous workers`);
  console.log(`======================================================`);

  const initialMem = process.memoryUsage();
  const startTime = Date.now();
  const allResults = [];
  let sent = 0;

  while (sent < totalRequests) {
    const batchSize = Math.min(concurrency, totalRequests - sent);
    const batchRequests = Array.from({ length: batchSize }, (_, i) => {
      const epIndex = (sent + i) % ENDPOINTS.length;
      return ENDPOINTS[epIndex];
    });

    const batchResults = await runBatch(batchRequests);
    allResults.push(...batchResults);
    sent += batchSize;

    if (delayBetweenBatchesMs > 0 && sent < totalRequests) {
      await new Promise((res) => setTimeout(res, delayBetweenBatchesMs));
    }
  }

  const durationSec = (Date.now() - startTime) / 1000;
  const finalMem = process.memoryUsage();

  const successCount = allResults.filter((r) => r.success).length;
  const failCount = allResults.length - successCount;
  const latencies = allResults.map((r) => r.latencyMs);
  const stats = calculateStats(latencies);
  const throughput = Number((allResults.length / durationSec).toFixed(2));

  console.log(`  ⏱️  Duration: ${durationSec.toFixed(2)}s`);
  console.log(`  📈 Throughput: ${throughput} requests/sec`);
  console.log(`  ✅ Successful: ${successCount} / ${allResults.length} (${((successCount / allResults.length) * 100).toFixed(1)}%)`);
  if (failCount > 0) {
    console.log(`  ❌ Failed: ${failCount}`);
  }
  console.log(`  ⚡ Response Times:`);
  console.log(`     - Min: ${stats.min} ms`);
  console.log(`     - Avg: ${stats.avg} ms`);
  console.log(`     - Median (p50): ${stats.p50} ms`);
  console.log(`     - 95th Percentile (p95): ${stats.p95} ms`);
  console.log(`     - 99th Percentile (p99): ${stats.p99} ms`);
  console.log(`     - Max: ${stats.max} ms`);
  console.log(`  🧠 Memory Usage:`);
  console.log(`     - Heap Used: ${(finalMem.heapUsed / 1024 / 1024).toFixed(2)} MB (Delta: ${((finalMem.heapUsed - initialMem.heapUsed) / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`     - RSS: ${(finalMem.rss / 1024 / 1024).toFixed(2)} MB`);

  return {
    title,
    totalRequests,
    concurrency,
    durationSec,
    throughput,
    successCount,
    failCount,
    stats,
  };
};

const runAllScenarios = async () => {
  console.log(`\n======================================================`);
  console.log(`🕉️  PERFORMANCE & TRAFFIC SIMULATION BENCHMARK SUITE`);
  console.log(`🎯 Targets: 500 Visitors/Day (Baseline) & 1,000 Visitors/Day (Growth)`);
  console.log(`======================================================\n`);

  // Step 1: Baseline Individual Endpoint Latency Check
  console.log(`--- PHASE 1: Baseline Individual Endpoint Latency Benchmark ---`);
  for (const ep of ENDPOINTS) {
    const res = await makeRequest(ep.path, ep.method);
    const statusIcon = res.success ? '✅' : '❌';
    console.log(`  ${statusIcon} ${ep.name.padEnd(24)}: ${res.latencyMs.toFixed(2).padStart(6)} ms (HTTP ${res.statusCode}, ${res.contentLength} bytes)`);
  }

  // Step 2: Realistic 500 Daily Visitors Load Profile
  // 500 daily visitors = ~80-100 peak visits/hr = ~1,500 req/hr = 0.5-1.5 req/s sustained, bursts of 10 concurrent requests
  const scenario500 = await executeScenario(
    'Scenario A: 500 Daily Visitors (Peak Hour Bursts)',
    100, // 100 representative requests in burst
    10,  // 10 concurrent requests (simulating peak simultaneous visitors)
    40   // 40ms pacing
  );

  // Step 3: Realistic 1,000 Daily Visitors Load Profile (Growth Target)
  // 1,000 daily visitors = ~160-200 peak visits/hr = ~3,000-4,000 req/hr = 1.0-3.0 req/s sustained, bursts of 25 concurrent requests
  const scenario1000 = await executeScenario(
    'Scenario B: 1,000 Daily Visitors (Growth Surge Bursts)',
    250, // 250 representative requests in high surge
    25,  // 25 concurrent requests (simulating sudden surge / burst)
    25   // 25ms pacing
  );

  console.log(`\n======================================================`);
  console.log(`🏁 PERFORMANCE VERIFICATION SUMMARY REPORT`);
  console.log(`======================================================`);
  console.log(`500 Daily Visitors Target:`);
  console.log(`  - Concurrency Tested: ${scenario500.concurrency} concurrent requests`);
  console.log(`  - Average Latency: ${scenario500.stats.avg} ms`);
  console.log(`  - p95 Latency: ${scenario500.stats.p95} ms`);
  console.log(`  - Error Rate: ${((scenario500.failCount / scenario500.totalRequests) * 100).toFixed(2)}%`);
  console.log(`  - Throughput Achieved: ${scenario500.throughput} req/sec`);
  console.log(`\n1,000 Daily Visitors Growth Target:`);
  console.log(`  - Concurrency Tested: ${scenario1000.concurrency} concurrent requests`);
  console.log(`  - Average Latency: ${scenario1000.stats.avg} ms`);
  console.log(`  - p95 Latency: ${scenario1000.stats.p95} ms`);
  console.log(`  - Error Rate: ${((scenario1000.failCount / scenario1000.totalRequests) * 100).toFixed(2)}%`);
  console.log(`  - Throughput Achieved: ${scenario1000.throughput} req/sec`);
  console.log(`======================================================\n`);
};

runAllScenarios().catch(console.error);
