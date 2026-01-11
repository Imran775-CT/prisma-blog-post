/**
 * This script demonstrates how to create a post in the Prisma Blog App.
 * It handles:
 * 1. Signing in to get an authentication session.
 * 2. Sending a POST request with the session cookie to create a post.
 */

const BASE_URL = 'http://localhost:3000';

// Replace with a valid user's credentials from your database
const CREDENTIALS = {
    email: 'news@gmail.com',
    password: 'admin1234'
};

async function createPostExample() {
    try {
        console.log('--- Step 1: Signing In ---');
        
        // We use fetch and need to capture the 'set-cookie' header manually for the next request
        // because native fetch in Node.js (without a cookie jar) doesn't persist cookies automatically.
        const signInRes = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Origin': BASE_URL,
                'Referer': BASE_URL + '/'
            },
            body: JSON.stringify(CREDENTIALS)
        });

        if (!signInRes.ok) {
            const error = await signInRes.json();
            console.error('Sign In Failed:', error);
            return;
        }

        console.log('Sign In Successful!');
        
        // Capture the session cookie
        const cookie = signInRes.headers.get('set-cookie');
        if (!cookie) {
            console.error('No session cookie received. Check your auth configuration.');
            return;
        }

        console.log('--- Step 2: Creating a Post ---');

        const postData = {
            title: "Exploring Prisma and Better Auth",
            content: "This is a comprehensive guide on how to integrate Prisma with Better Auth in an Express application. It covers schema design, middleware protection, and more.",
            thumbnail: "https://example.com/image.jpg",
            tags: ["prisma", "express", "auth"],
            status: "PUBLISHED",
            isFeatured: true
        };

        const createPostRes = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie, // Crucial: send the captured session cookie
                'Origin': BASE_URL
            },
            body: JSON.stringify(postData)
        });

        const result = await createPostRes.json();

        if (createPostRes.ok) {
            console.log('Post Created Successfully!');
            console.log('Post Details:', JSON.stringify(result.data, null, 2));
        } else {
            console.error('Create Post Failed!');
            console.error('Status:', createPostRes.status);
            console.error('Error Details:', JSON.stringify(result, null, 2));
        }

    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

createPostExample();
