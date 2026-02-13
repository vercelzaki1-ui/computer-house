import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifySetup() {
  console.log('🔍 Verifying ComputerHouse Setup...\n');

  try {
    // Check tables exist
    console.log('✓ Checking database tables...');
    const tables = [
      'departments',
      'categories',
      'brands',
      'products',
      'product_images',
      'product_specs',
      'product_variants',
      'carts',
      'cart_items',
      'addresses',
      'orders',
      'order_items',
      'shipping_wilayas',
      'shipping_rates',
      'shipping_rules',
      'homepage_banners',
      'marquee_brands',
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.log(`  ✗ ${table}: ${error.message}`);
      } else {
        console.log(`  ✓ ${table}`);
      }
    }

    // Check wilayas
    console.log('\n✓ Checking wilayas...');
    const { data: wilayas, error: wilayaError } = await supabase
      .from('shipping_wilayas')
      .select('*')
      .limit(1);
    if (wilayaError) {
      console.log(`  ✗ Failed to query wilayas: ${wilayaError.message}`);
    } else {
      const { count } = await supabase
        .from('shipping_wilayas')
        .select('id', { count: 'exact', head: true });
      console.log(`  ✓ Found ${count} wilayas`);
    }

    // Check shipping rates
    console.log('\n✓ Checking shipping rates...');
    const { count: ratesCount } = await supabase
      .from('shipping_rates')
      .select('id', { count: 'exact', head: true });
    console.log(`  ✓ Found ${ratesCount} shipping rates`);

    // Check departments
    console.log('\n✓ Checking departments...');
    const { count: deptCount } = await supabase
      .from('departments')
      .select('id', { count: 'exact', head: true });
    console.log(`  ✓ Found ${deptCount} departments`);

    // Check categories
    console.log('\n✓ Checking categories...');
    const { count: catCount } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true });
    console.log(`  ✓ Found ${catCount} categories`);

    console.log('\n✅ Setup verification complete!\n');
    console.log('Next steps:');
    console.log('1. Set ADMIN_PANEL_PASSWORD env var');
    console.log('2. Visit /admin/login to test admin access');
    console.log('3. Create your first product via /admin/products/new');
    console.log('4. Test storefront at /shop\n');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifySetup();
