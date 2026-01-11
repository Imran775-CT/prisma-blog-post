import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ 
    baseURL: 'http://localhost:3000',
    jar,
    withCredentials: true
}));

async function testPostCreation() {
    const timestamp = Date.now();
    const testUser = {
        email: `admin_tester_${timestamp}@example.com`,
        password: 'password123',
        name: 'Admin Tester'
    };

    try {
        console.log('1. Signing Up...');
        await client.post('/api/auth/sign-up/email', testUser);
        
        console.log('2. Signing In...');
        await client.post('/api/auth/sign-in/email', {
            email: testUser.email,
            password: testUser.password
        });

        console.log('3. Attempting to Create Post...');
        const createPostRes = await client.post('/posts', {
            title: 'Test Post Persistence',
            content: 'This post should stay in the database for verification.',
            tags: ['test']
        });
        console.log('Create Post Success:', JSON.stringify(createPostRes.data, null, 2));

    } catch (error: any) {
        console.error('FAILED to create post!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testPostCreation();
