import http from 'http';

// Native fetch used in Node 18+

// Using built-in fetch if Node 18+, otherwise this might fail if node-fetch isn't installed.
// Backend uses "type": "module", so imports work. 
// However, let's stick to standard node http or simple fetch if available.
// Node 18+ has global fetch.


function request(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function verify() {
    try {
        console.log('1. Logging in as Admin...');
        const adminLogin = await request('POST', '/api/auth/login', { email: 'john@example.com', password: 'admin123' });
        if (!adminLogin.data.token) throw new Error('Admin login failed');
        const adminToken = adminLogin.data.token;
        console.log('   Admin logged in.');

        console.log('2. Creating Test Event...');
        const createEvent = await request('POST', '/api/events', {
            title: 'Delete Test Event',
            description: 'To be deleted',
            location: 'Test Location',
            date: '2025-12-31',
            time: '23:59',
            category: 'Music',
            price: 10,
            total_seats: 100
        }, { 'Authorization': `Bearer ${adminToken}` });

        if (!createEvent.data.event) throw new Error('Event creation failed: ' + JSON.stringify(createEvent.data));
        const eventId = createEvent.data.event.id;
        console.log(`   Event created (ID: ${eventId}).`);

        console.log('3. Registering Test User...');
        const userEmail = `testuser${Date.now()}@test.com`;
        const registerUser = await request('POST', '/api/auth/register', { name: 'Test User', email: userEmail, password: 'password123' });

        let userToken;
        if (registerUser.data.token) {
            userToken = registerUser.data.token;
        } else {
            const userLogin = await request('POST', '/api/auth/login', { email: userEmail, password: 'password123' });
            userToken = userLogin.data.token;
        }
        if (!userToken) throw new Error('User registration failed');
        console.log('   User ready.');

        console.log('4. Booking Ticket...');
        const bookTicket = await request('POST', '/api/bookings', {
            event_id: eventId,
            num_tickets: 1
        }, { 'Authorization': `Bearer ${userToken}` });

        if (!bookTicket.data.booking) throw new Error('Booking failed: ' + JSON.stringify(bookTicket.data));
        console.log(`   Booking created (ID: ${bookTicket.data.booking.id}).`);

        console.log('5. Deleting Event (Cascade Test)...');
        const deleteEvent = await request('DELETE', `/api/events/${eventId}`, null, { 'Authorization': `Bearer ${adminToken}` });

        if (deleteEvent.status === 200) {
            console.log('✅ Event deleted successfully!');
            console.log('   Response:', deleteEvent.data.message);
        } else {
            console.error('❌ Delete failed:', deleteEvent.data);
            process.exit(1);
        }

        console.log('6. Verifying Deletion...');
        const checkEvent = await request('GET', `/api/events/${eventId}`);
        if (checkEvent.status === 404) {
            console.log('✅ Verified: Event is gone (404).');
        } else {
            console.log('❌ Error: Event still exists or other error.');
            process.exit(1);
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    }
}

verify();
