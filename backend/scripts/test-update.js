(async () => {
  const url = 'http://localhost:4000/';
  const headers = { 'Content-Type': 'application/json' };

  function gql(query, variables = {}, token) {
    const h = { ...headers };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return fetch(url, { method: 'POST', headers: h, body: JSON.stringify({ query, variables }) }).then(res => res.json());
  }

  try {
    console.log('Registering user...');
    const registerRes = await gql(`mutation Register($name: String!, $email: String!, $password: String!) { register(name: $name, email: $email, password: $password) { token user { id name email } } }`, { name: 'Test User', email: `test+${Date.now()}@example.com`, password: 'password123' });
    console.log('Register response:', JSON.stringify(registerRes, null, 2));
    const token = registerRes.data?.register?.token;
    if (!token) {
      console.error('No token received, aborting');
      process.exit(1);
    }

    console.log('Creating category...');
    const createRes = await gql(`mutation CreateCategory($name: String!, $description: String, $color: String, $icon: String) { createCategory(name: $name, description: $description, color: $color, icon: $icon) { id name description color icon } }`, { name: 'TempCat', description: 'temp', color: 'emerald', icon: 'tag' }, token);
    console.log('Create response:', JSON.stringify(createRes, null, 2));
    const catId = createRes.data?.createCategory?.id;
    if (!catId) {
      console.error('No category id, aborting');
      process.exit(1);
    }

    console.log('Updating category...');
    const updateRes = await gql(`mutation UpdateCategory($id: String!, $name: String!, $description: String, $color: String, $icon: String) { updateCategory(id: $id, name: $name, description: $description, color: $color, icon: $icon) { id name description color icon } }`, { id: catId, name: 'TempCatUpdated', description: 'updated', color: 'blue', icon: 'card' }, token);
    console.log('Update response:', JSON.stringify(updateRes, null, 2));
  } catch (err) {
    console.error('Error during test:', err);
    process.exit(1);
  }
})();
