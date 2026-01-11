const BASE_URL = 'http://localhost:3000';

async function testPost() {
    const timestamp = Date.now();
    const email = `test_${timestamp}@example.com`;
    const password = 'password123';

    try {
        console.log('1. Signing Up...');
        const signUpRes = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Origin': BASE_URL,
                'Referer': BASE_URL + '/'
            },
            body: JSON.stringify({ email, password, name: 'Tester' })
        });
        const signUpData = await signUpRes.json();
        console.log('Sign Up Status:', signUpRes.status);

        // Sign In to get cookie
        console.log('2. Signing In...');
        const signInRes = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Origin': BASE_URL,
                'Referer': BASE_URL + '/'
            },
            body: JSON.stringify({ email, password })
        });
        console.log('Sign In Status:', signInRes.status);
        const cookie = signInRes.headers.get('set-cookie');

        console.log('3. Creating Post...');
        const createPostRes = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie || ''
            },
            body: JSON.stringify({
                title: 'Post from Fetch ' + timestamp,
                content: 'This is some content for the post.',
                tags: ['fetch', 'test']
            })
        });
        const createPostData = await createPostRes.json();
        console.log('Create Post Status:', createPostRes.status);
        console.log('Create Post Data:', JSON.stringify(createPostData, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

testPost();
