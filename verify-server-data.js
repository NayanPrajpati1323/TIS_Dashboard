import http from 'http';

const testEndpoints = [
  'http://localhost:3000/api/health',
  'http://localhost:3000/api/customers',
  'http://localhost:3000/api/invoices', 
  'http://localhost:3000/api/quotations',
  'http://localhost:3000/api/products',
  'http://localhost:3000/api/categories',
  'http://localhost:3000/api/units'
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const count = parsed.data ? (Array.isArray(parsed.data) ? parsed.data.length : 1) : 0;
          resolve({ 
            url, 
            status: res.statusCode, 
            success: parsed.success,
            count: count,
            data: parsed.data
          });
        } catch (e) {
          resolve({ url, status: res.statusCode, success: false, error: 'Parse error' });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({ url, status: 0, success: false, error: err.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, status: 0, success: false, error: 'Timeout' });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');
  
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint);
    
    if (result.success && result.status === 200) {
      console.log(`✅ ${endpoint}`);
      console.log(`   Status: ${result.status} | Records: ${result.count}`);
      if (result.count > 0 && result.data) {
        console.log(`   Sample: ${JSON.stringify(result.data[0] || result.data, null, 2).substring(0, 100)}...`);
      }
    } else {
      console.log(`❌ ${endpoint}`);
      console.log(`   Status: ${result.status} | Error: ${result.error || 'Unknown'}`);
    }
    console.log('');
  }
  
  console.log('🏁 Test complete!\n');
  
  console.log('🔧 Troubleshooting tips:');
  console.log('- Make sure server is running: node dist/server/node-build.mjs');
  console.log('- Check if database is properly seeded');
  console.log('- Verify API endpoints are responding');
  console.log('- Look for errors in server console');
}

runTests().catch(console.error);
