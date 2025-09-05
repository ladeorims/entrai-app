/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-undef */
// =========================================================================
// FILE: server/server.js
// Description: A foundational Express server to handle API calls with SendGrid email verification,
//              now updated with AI integration and client management for sales-related functionalities.
// =========================================================================

// Import necessary libraries.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import OpenAI from 'openai';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// =========================================================================
// STRIPE WEBHOOK LISTENER
// This route must come BEFORE express.json() to receive the raw request body
// =========================================================================
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log(`❌ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const customerEmail = session.customer_details.email;
        
        console.log(`🔔 Payment successful for checkout session. Customer email: ${customerEmail}`);
        
        // Retrieve subscription to get the plan details
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0].price.id;

        let planType = 'free'; // Default
        if (priceId === process.env.STRIPE_SOLO_PLAN_PRICE_ID) {
            planType = 'solo';
        } else if (priceId === process.env.STRIPE_TEAM_PLAN_PRICE_ID) {
            planType = 'team';
        }

        try {
            const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [customerEmail]);
            if (userRes.rows.length > 0) {
                const userId = userRes.rows[0].id;
                await pool.query(
                    `UPDATE users SET subscription_status = 'active', plan_type = $1, trial_ends_at = NULL WHERE id = $2`,
                    [planType, userId]
                );
                console.log(`✅ Subscription for user ${userId} updated to '${planType}' and status to 'active'`);
            } else {
                 console.error(`Webhook Error: No user found with email ${customerEmail}`);
            }
        } catch (dbError) {
            console.error('Error updating user subscription in database:', dbError);
        }
    }

    res.status(200).json({ received: true });
});



// Middleware Setup
app.use(express.json({ limit: '5mb' }));
app.use(cors());

const generateInvoicePDF = async (invoiceId, userId) => {
    const doc = new jsPDF();

    // Fetch all necessary data in one go
    const userRes = await pool.query('SELECT name, company, email, phone_number, address, city_province_postal, company_logo_url FROM users WHERE id = $1', [userId]);
    const invoiceRes = await pool.query('SELECT i.*, c.name as client_name, c.email as client_email FROM invoices i JOIN clients c ON i.client_id = c.id WHERE i.id = $1 AND i.user_id = $2', [invoiceId, userId]);
    const lineItemsRes = await pool.query('SELECT * FROM invoice_line_items WHERE invoice_id = $1', [invoiceId]);

    if (invoiceRes.rows.length === 0 || userRes.rows.length === 0) {
        throw new Error('Invoice or user not found');
    }

    const user = userRes.rows[0];
    const invoice = invoiceRes.rows[0];
    invoice.lineItems = lineItemsRes.rows;

    // --- Start Building PDF ---

    // Add Company Logo if it exists
     if (user.company_logo_url) {
        try {
            const imgData = user.company_logo_url;
            doc.addImage(imgData, 'PNG', 14, 15, 30, 15);
        } catch (e) {
            console.error("Could not add logo to PDF:", e);
        }
    }

    // Add Company Info
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(user.company || user.name, 14, 40);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(user.address || '', 14, 46);
    doc.text(user.city_province_postal || '', 14, 50);

    // Add Invoice Details
    doc.setFontSize(26);
    doc.setFont(undefined, 'bold');
    doc.text("INVOICE", 200, 22, { align: 'right' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoice_number}`, 200, 40, { align: 'right' });
    doc.text(`Issue Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, 200, 46, { align: 'right' });
    doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 200, 52, { align: 'right' });
    
    // Add Client Info
    doc.text("Bill To:", 14, 70);
    doc.setFont(undefined, 'bold');
    doc.text(invoice.client_name, 14, 76);

    // Add Line Items Table
    const tableColumn = user.business_type === 'goods' 
        ? ["Item", "Quantity", "Unit Price", "Total"] 
        : ["Service", "Amount"];
    
    const tableRows = [];
    invoice.lineItems.forEach(item => {
        const itemData = user.business_type === 'goods'
            ? [item.description, item.quantity, `$${Number(item.unit_price).toFixed(2)}`, `$${Number(item.total).toFixed(2)}`]
            : [item.description, `$${Number(item.total).toFixed(2)}`];
        tableRows.push(itemData);
    });

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 85, theme: 'striped' });


    const finalY = doc.lastAutoTable.finalY || 150;

    // Add Totals
    doc.setFontSize(12);
    doc.text(`Subtotal: $${(invoice.total_amount - invoice.tax_amount).toFixed(2)}`, 200, finalY + 15, { align: 'right' });
    doc.text(`Tax (${invoice.tax_rate}%): $${Number(invoice.tax_amount).toFixed(2)}`, 200, finalY + 22, { align: 'right' });
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: $${Number(invoice.total_amount).toLocaleString()}`, 200, finalY + 30, { align: 'right' });

    // Return the PDF document as a buffer
    return Buffer.from(doc.output('arraybuffer'));
};

// =========================================================================
// DATABASE CONNECTION & SCHEMA UPDATES
// =========================================================================
const requiredEnv = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT', 'JWT_SECRET', 'SENDGRID_API_KEY', 'OPENAI_API_KEY'];
for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.error(`Error: Missing required environment variable - ${key}`);
        process.exit(1);
    }
}

// ➡️ UPDATED: Consolidated all table creation logic into one clean function
// Replace the existing pg.Pool configuration in server.js with this

const pool = new pg.Pool(
    process.env.DATABASE_URL ? {
        // This configuration is used for production environments like Render
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    } : {
        // This configuration is used for your local development environment
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    }
);

const initializeDatabase = async () => {
    // UPDATED: Added the created_at column to the main table definition
    const userTableQuery = `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(255), company VARCHAR(255), phone_number VARCHAR(20), address VARCHAR(255), city_province_postal VARCHAR(255), is_verified BOOLEAN DEFAULT FALSE, profile_picture_url TEXT, company_description TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    
    const clientsTableQuery = `CREATE TABLE IF NOT EXISTS clients (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone_number VARCHAR(20), company_name VARCHAR(255), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, CONSTRAINT unique_client_email_per_user UNIQUE (user_id, email))`;
    const salesDealsTableQuery = `CREATE TABLE IF NOT EXISTS sales_deals (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE, name VARCHAR(255) NOT NULL, value NUMERIC(12, 2) NOT NULL, stage VARCHAR(50) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    const dealNotesTableQuery = `CREATE TABLE IF NOT EXISTS deal_notes (id SERIAL PRIMARY KEY, deal_id INTEGER NOT NULL REFERENCES sales_deals(id) ON DELETE CASCADE, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, note TEXT NOT NULL, type VARCHAR(50), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    const tasksTableQuery = `CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, title TEXT NOT NULL, status VARCHAR(50) DEFAULT 'incomplete', priority VARCHAR(50) DEFAULT 'Medium', due_date TIMESTAMPTZ, is_deleted BOOLEAN DEFAULT FALSE, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    const transactionsTableQuery = `CREATE TABLE IF NOT EXISTS transactions (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(255) NOT NULL, amount NUMERIC(12, 2) NOT NULL, type VARCHAR(50) NOT NULL, category VARCHAR(100), transaction_date TIMESTAMPTZ NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    const campaignsTableQuery = `CREATE TABLE IF NOT EXISTS campaigns (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, name VARCHAR(255) NOT NULL, platform VARCHAR(100), ad_spend NUMERIC(12, 2) DEFAULT 0, reach INTEGER DEFAULT 0, engagement INTEGER DEFAULT 0, conversions INTEGER DEFAULT 0, start_date TIMESTAMPTZ, end_date TIMESTAMPTZ, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    const contentCalendarTableQuery = `CREATE TABLE IF NOT EXISTS content_calendar (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, post_text TEXT, platform VARCHAR(100), status VARCHAR(50) DEFAULT 'draft', post_date TIMESTAMPTZ, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    const invoicesTableQuery = `CREATE TABLE IF NOT EXISTS invoices (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE, invoice_number VARCHAR(100) NOT NULL, issue_date TIMESTAMPTZ NOT NULL, due_date TIMESTAMPTZ NOT NULL, total_amount NUMERIC(12, 2) NOT NULL, status VARCHAR(50) DEFAULT 'draft', notes TEXT, tax_rate NUMERIC(5, 2) DEFAULT 0.00, tax_amount NUMERIC(12, 2) DEFAULT 0.00, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    const invoiceLineItemsTableQuery = `CREATE TABLE IF NOT EXISTS invoice_line_items (id SERIAL PRIMARY KEY, invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE, description TEXT NOT NULL, quantity NUMERIC(10, 2) NOT NULL, unit_price NUMERIC(12, 2) NOT NULL, total NUMERIC(12, 2) NOT NULL)`;
    const automationsTableQuery = `CREATE TABLE IF NOT EXISTS automations (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, name VARCHAR(255) NOT NULL, trigger_type VARCHAR(100) NOT NULL, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    const automationActionsTableQuery = `CREATE TABLE IF NOT EXISTS automation_actions (id SERIAL PRIMARY KEY, automation_id INTEGER NOT NULL REFERENCES automations(id) ON DELETE CASCADE, action_type VARCHAR(100) NOT NULL, params JSONB)`;
    
    // UPDATED: Also added created_at here to ensure it gets added to existing tables
    const alterUsersTableQuery = `
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
        ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'free',
        ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'inactive',
        ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS free_automations_used INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS business_type VARCHAR(50) DEFAULT 'services',
        ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS primary_goal VARCHAR(255),
        ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'user',
        ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        ALTER COLUMN profile_picture_url TYPE TEXT;
    `;
    
    const alterInvoicesQuery = `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ;`;

    try {
        await pool.query(userTableQuery);
        await pool.query(clientsTableQuery);
        await pool.query(salesDealsTableQuery);
        await pool.query(dealNotesTableQuery);
        await pool.query(tasksTableQuery);
        await pool.query(transactionsTableQuery);
        await pool.query(campaignsTableQuery);
        await pool.query(contentCalendarTableQuery);
        await pool.query(invoicesTableQuery);
        await pool.query(invoiceLineItemsTableQuery);
        await pool.query(automationsTableQuery);
        await pool.query(automationActionsTableQuery);
        
        await pool.query(alterUsersTableQuery);
        await pool.query(alterInvoicesQuery);

        console.log('All tables created or already exist.');
        console.log('Schema updates successful.');
    } catch (err) {
        console.error('Error during database initialization:', err);
        throw err;
    }
};
// =========================================================================
// EMAIL & AI SERVICE CONFIGURATION
// =========================================================================
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // lock to latest stable
});


// =========================================================================
// MIDDLEWARE
// =========================================================================
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch user role from DB and attach to request object
        const userRes = await pool.query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
        if (userRes.rows.length === 0) return res.sendStatus(403);
        
        req.user = { ...decoded, role: userRes.rows[0].role };
        next();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
        return res.sendStatus(403);
    }
};

// Add this new middleware to server/server.js
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
};

// NEW: "Gatekeeper" middleware to check user's subscription and plan
const checkSubscription = (allowedPlans) => {
    return async (req, res, next) => {
        const { userId } = req.user;
        try {
            const userRes = await pool.query('SELECT plan_type, subscription_status, trial_ends_at FROM users WHERE id = $1', [userId]);
            if (userRes.rows.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }
            const user = userRes.rows[0];
            const isTrialing = user.subscription_status === 'trialing' && new Date(user.trial_ends_at) > new Date();
            const isActiveSub = user.subscription_status === 'active';
            const isBeta = user.subscription_status === 'beta';

            if (isTrialing || isActiveSub || isBeta) {
                if (allowedPlans.includes(user.plan_type) || isBeta) {
                    req.user.plan = user; // Attach plan info to the request
                    return next();
                } else {
                    return res.status(403).json({ message: `Upgrade to a ${allowedPlans.join(' or ')} plan to access this feature.` });
                }
            } else {
                return res.status(403).json({ message: "Your trial has expired or your subscription is inactive. Please upgrade to continue." });
            }
        } catch (error) {
            console.error("Subscription check error:", error);
            return res.status(500).json({ message: "Server error during subscription check." });
        }
    };
};


// =========================================================================
// AUTHENTICATION ROUTES
// =========================================================================
app.post('/api/signup', async (req, res) => {
    const { email, password, name, company, phoneNumber, companyDescription } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserResult = await client.query(
            'INSERT INTO users (email, password, name, company, phone_number, company_description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [email, hashedPassword, name, company, phoneNumber, companyDescription]
        );
        const userId = newUserResult.rows[0].id;

        await client.query(
            `UPDATE users SET subscription_status = 'trialing', trial_ends_at = NOW() + INTERVAL '14 days', plan_type = 'solo' WHERE id = $1`,
            [userId]
        );

        const verificationToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // CORRECTED: The link now points to your live backend server
        const verificationUrl = `${process.env.BACKEND_URL}/api/verify-email?token=${verificationToken}`;

        const msg = {
            to: email,
            from: 'dami@cytrustadvisory.ca',
            subject: 'Welcome to Entrai! Please Verify Your Email',
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 40px;">
                    <h2>Welcome to Entrai!</h2>
                    <p>Thanks for signing up. Please click the button below to verify your email address and start your trial.</p>
                    <a href="${verificationUrl}" style="background-color: #5b8cff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">
                        Verify My Email
                    </a>
                    <p style="margin-top: 30px; font-size: 12px; color: #888;">If you did not sign up for this account, you can safely ignore this email.</p>
                </div>
            `,
        };
        await sgMail.send(msg);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Account created! Please check your email to verify your account and complete setup.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Server error during signup.' });
    } finally {
        client.release();
    }
});

// Add this new route to server/server.js, after the signup route

app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('Verification token is missing.');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;
        await pool.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [userId]);
        // Redirect user to the login page with a success message
        res.redirect(`${process.env.FRONTEND_URL}?verified=true`);
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(400).send('Invalid or expired verification link.');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
        if (!user.is_verified) return res.status(401).json({ message: 'Please verify your email to log in.' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
        
        // NEW: Update last_login_at timestamp
        await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

        const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add this new route for users to request a password reset
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const userRes = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
            // To prevent attackers from checking which emails are registered, we send a success message even if the user doesn't exist.
            return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }
        
        const user = userRes.rows[0];
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        // CORRECTED: Email content is now for password reset
        const msg = {
            to: email,
            from: 'dami@cytrustadvisory.ca', // This MUST be a verified sender in your SendGrid account
            subject: 'Password Reset Request for Your Entrai Account',
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 40px;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset the password for your account. Please click the button below to set a new password. This link is valid for one hour.</p>
                    <a href="${resetUrl}" style="background-color: #5b8cff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">
                        Reset Your Password
                    </a>
                    <p style="margin-top: 30px; font-size: 12px; color: #888;">If you did not request a password reset, you can safely ignore this email.</p>
                </div>
            `,
        };
        await sgMail.send(msg);

        res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (err) {
        console.error('Error in forgot password:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Add this new route for users to submit their new password
app.post('/api/reset-password', async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
        res.status(200).json({ message: 'Password has been reset successfully. Please log in.' });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(400).json({ message: 'Invalid or expired password reset link.' });
    }
});


// ➡️ NEW: GET endpoint to fetch the full user profile.
app.get('/api/profile', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        // Use SQL aliasing to convert snake_case columns to camelCase keys in the JSON response
        const result = await pool.query(
            `SELECT 
                id, 
                name, 
                email, 
                company, 
                phone_number AS "phoneNumber", 
                profile_picture_url AS "profilePictureUrl", 
                company_description AS "companyDescription",
                company_logo_url AS "companyLogoUrl",
                address,
                city_province_postal AS "cityProvincePostal",
                plan_type AS "planType",
                subscription_status AS "subscriptionStatus",
                trial_ends_at AS "trialEndsAt",
                role
            FROM users WHERE id = $1`, 
            [userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATED: PUT /api/profile also returns consistent camelCase keys
app.put('/api/profile', authenticateToken, async (req, res) => {
    const { name, company, phoneNumber, profilePictureUrl, companyDescription, companyLogoUrl, address, cityProvincePostal } = req.body;
    const { userId } = req.user;

    try {
        const result = await pool.query(
            `UPDATE users SET 
                name = $1, company = $2, phone_number = $3, profile_picture_url = $4, 
                company_description = $5, company_logo_url = $6, address = $7, city_province_postal = $8
             WHERE id = $9 RETURNING *`,
            [name, company, phoneNumber, profilePictureUrl, companyDescription, companyLogoUrl, address, cityProvincePostal, userId]
        );
        const updatedUser = result.rows[0];
        
        const newToken = jwt.sign(
            { userId: updatedUser.id, email: updatedUser.email, name: updatedUser.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Construct the user object with camelCase keys to ensure consistency
        const userPayload = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            company: updatedUser.company,
            phoneNumber: updatedUser.phone_number,
            profilePictureUrl: updatedUser.profile_picture_url,
            companyDescription: updatedUser.company_description,
            companyLogoUrl: updatedUser.company_logo_url,
            address: updatedUser.address,
            cityProvincePostal: updatedUser.city_province_postal,
            planType: updatedUser.plan_type,
            subscriptionStatus: updatedUser.subscription_status,
            trialEndsAt: updatedUser.trial_ends_at
        };

        res.status(200).json({ 
            message: 'Profile updated successfully.', 
            token: newToken,
            user: userPayload 
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: Endpoint to handle the submission of the first-time onboarding form
app.put('/api/profile/onboarding', authenticateToken, async (req, res) => {
    const { businessType, company, companyLogoUrl, primaryGoal } = req.body;
    const { userId } = req.user;

    try {
        await pool.query(
            `UPDATE users SET 
                business_type = $1, 
                company = $2, 
                company_logo_url = $3, 
                primary_goal = $4,
                is_onboarded = TRUE 
             WHERE id = $5`,
            [businessType, company, companyLogoUrl, primaryGoal, userId]
        );

        // Fetch the full, updated user profile to send back
        const updatedUserRes = await pool.query(
            `SELECT 
                id, name, email, company, phone_number AS "phoneNumber", 
                profile_picture_url AS "profilePictureUrl", company_description AS "companyDescription",
                company_logo_url AS "companyLogoUrl", address, city_province_postal AS "cityProvincePostal",
                plan_type AS "planType", subscription_status AS "subscriptionStatus", 
                trial_ends_at AS "trialEndsAt", is_onboarded AS "isOnboarded"
            FROM users WHERE id = $1`,
            [userId]
        );
        
        res.status(200).json({ message: 'Onboarding complete!', user: updatedUserRes.rows[0] });

    } catch (err) {
        console.error('Error saving onboarding data:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// =========================================================================
// ADMIN API ROUTES
// =========================================================================
app.get('/api/admin/overview', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const totalUsersQuery = pool.query('SELECT COUNT(*) AS total_users FROM users');
        const newSignupsQuery = pool.query('SELECT COUNT(*) AS new_signups_today FROM users WHERE created_at >= NOW() - INTERVAL \'1 day\'');
        const activeUsersQuery = pool.query('SELECT COUNT(*) AS active_users_weekly FROM users WHERE last_login_at >= NOW() - INTERVAL \'7 days\'');
        const signupsChartQuery = pool.query(`
            SELECT DATE(created_at) AS date, COUNT(*) AS signups
            FROM users
            WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC;
        `);

        const [
            totalUsersRes,
            newSignupsRes,
            activeUsersRes,
            signupsChartRes
        ] = await Promise.all([totalUsersQuery, newSignupsQuery, activeUsersQuery, signupsChartQuery]);

        res.status(200).json({
            totalUsers: totalUsersRes.rows[0].total_users,
            newSignupsToday: newSignupsRes.rows[0].new_signups_today,
            activeUsersWeekly: activeUsersRes.rows[0].active_users_weekly,
            signupsChartData: signupsChartRes.rows
        });

    } catch (err) {
        console.error('Error fetching admin overview data:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: Endpoint to get a list of all users for the admin
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Use SQL aliasing to send back clean, camelCase data
        const query = `
            SELECT 
                id,
                name,
                email,
                plan_type AS "planType",
                subscription_status AS "subscriptionStatus",
                last_login_at AS "lastLoginAt",
                created_at AS "createdAt"
            FROM users
            ORDER BY created_at DESC;
        `;
        const usersResult = await pool.query(query);
        res.status(200).json(usersResult.rows);
    } catch (err) {
        console.error('Error fetching all users for admin:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/admin/users/:id/trigger-reset', authenticateToken, requireAdmin, async (req, res) => {
    const { id: targetUserId } = req.params;
    
    try {
        const userRes = await pool.query('SELECT email FROM users WHERE id = $1', [targetUserId]);
        if (userRes.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const userEmail = userRes.rows[0].email;

        // Create a short-lived, single-purpose token for password reset
        const resetToken = jwt.sign({ userId: targetUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const msg = {
            to: userEmail,
            from: 'dami@cytrustadvisory.ca', // Must be a verified sender
            subject: 'Password Reset for your Entrai Account',
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 40px;">
                    <h2>Password Reset Request</h2>
                    <p>A password reset was initiated for your account by an administrator. Please click the button below to set a new password. This link is valid for one hour.</p>
                    <a href="${resetUrl}" style="background-color: #5b8cff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">
                        Reset Your Password
                    </a>
                    <p style="margin-top: 30px; font-size: 12px; color: #888;">If you did not request this, please contact support immediately.</p>
                </div>
            `,
        };

        await sgMail.send(msg);

        res.status(200).json({ message: `Password reset link sent successfully to ${userEmail}.` });

    } catch (err) {
        console.error('Error triggering password reset:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.put('/api/admin/users/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [id]);
        res.status(200).json({ message: 'User successfully verified.' });
    } catch (err) {
        console.error('Error verifying user:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.put('/api/admin/users/:id/plan', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { planType } = req.body;
    try {
        await pool.query('UPDATE users SET plan_type = $1 WHERE id = $2', [planType, id]);
        res.status(200).json({ message: `User plan changed to ${planType}.` });
    } catch (err) {
        console.error('Error updating user plan:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// =========================================================================
// SALES & CLIENTS API ROUTES
// =========================================================================

// POST a new client for the logged-in user
// Replace in server/server.js

app.post('/api/sales/clients', authenticateToken, async (req, res) => {
    const { name, email, phoneNumber, companyName } = req.body;
    const { userId } = req.user;
    try {
        const existingClient = await pool.query('SELECT * FROM clients WHERE email = $1 AND user_id = $2', [email, userId]);
        if (existingClient.rows.length > 0) {
            return res.status(409).json({ message: 'Client with this email already exists.' });
        }
        const newClientResult = await pool.query(
            'INSERT INTO clients (user_id, name, email, phone_number, company_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, name, email, phoneNumber, companyName]
        );
        const newClient = newClientResult.rows[0];

        // NEW: Define the next actions for the Smart Prompt
        const next_actions = [
            { type: 'create_welcome_task', label: `Create task to send welcome kit to ${newClient.name}` }
        ];

        // Respond with the new client data AND the suggested actions
        res.status(201).json({ client: newClient, next_actions });
    } catch (err) {
        console.error('Error adding new client:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all clients for the logged-in user
app.get('/api/sales/clients', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const clients = await pool.query('SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.status(200).json(clients.rows);
    } catch (err) {
        console.error('Error fetching clients:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/sales/clients/check', authenticateToken, async (req, res) => {
    const { email } = req.query;
    const { userId } = req.user;

    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required.' });
    }

    try {
        const result = await pool.query('SELECT id, name FROM clients WHERE email = $1 AND user_id = $2', [email, userId]);
        if (result.rows.length > 0) {
            res.status(200).json({ exists: true, client: result.rows[0] });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (err) {
        console.error('Error checking client email:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET a specific client by ID for the logged-in user.
app.get('/api/sales/clients/:clientId', authenticateToken, async (req, res) => {
    const { clientId } = req.params;
    const { userId } = req.user;
    try {
        const client = await pool.query('SELECT * FROM clients WHERE id = $1 AND user_id = $2', [clientId, userId]);
        if (client.rows.length === 0) {
            return res.status(404).json({ message: 'Client not found or user not authorized.' });
        }
        res.status(200).json(client.rows[0]);
    } catch (err) {
        console.error('Error fetching client:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to server/server.js in the SALES & CLIENTS section

// NEW: Endpoint specifically for the CRM to get a list of all clients
app.get('/api/crm/clients', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        // This query fetches each client along with a count of their deals and total value
        const query = `
            SELECT 
                c.id, 
                c.name, 
                c.email, 
                c.company_name AS "companyName",
                COUNT(sd.id) AS deal_count,
                COALESCE(SUM(sd.value), 0) AS total_value
            FROM clients c
            LEFT JOIN sales_deals sd ON c.id = sd.client_id AND sd.stage = 'Closed Won'
            WHERE c.user_id = $1
            GROUP BY c.id
            ORDER BY c.name ASC;
        `;
        const clients = await pool.query(query, [userId]);
        res.status(200).json(clients.rows);
    } catch (err) {
        console.error('Error fetching CRM client list:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/crm/clients/:id', authenticateToken, async (req, res) => {
    const { id: clientId } = req.params;
    const { userId } = req.user;
    let userCompanyDescription = '';

    try {
        const userRes = await pool.query('SELECT company_description FROM users WHERE id = $1', [userId]);
        if (userRes.rows.length > 0) {
            userCompanyDescription = userRes.rows[0].company_description;
        }

        const [clientRes, dealsRes, invoicesRes] = await Promise.all([
            pool.query('SELECT id, name, email, phone_number AS "phoneNumber", company_name AS "companyName" FROM clients WHERE id = $1 AND user_id = $2', [clientId, userId]),
            pool.query('SELECT * FROM sales_deals WHERE client_id = $1 AND user_id = $2 ORDER BY created_at DESC', [clientId, userId]),
            pool.query('SELECT * FROM invoices WHERE client_id = $1 AND user_id = $2 ORDER BY created_at DESC', [clientId, userId])
        ]);

        if (clientRes.rows.length === 0) {
            return res.status(404).json({ message: 'Client not found.' });
        }
        
        const deals = dealsRes.rows;
        const dealIds = deals.map(d => d.id);
        
        // NEW: Fetch all notes associated with this client's deals
        const notesRes = dealIds.length > 0 ? await pool.query('SELECT * FROM deal_notes WHERE deal_id = ANY($1::int[]) ORDER BY created_at DESC', [dealIds]) : { rows: [] };

        const clientData = {
            details: clientRes.rows[0],
            deals: deals,
            invoices: invoicesRes.rows,
            notes: notesRes.rows // Add the notes to the response
        };

        // --- AI Next Best Action ---
        const historySummary = `
            Recent Deals: ${clientData.deals.map(d => `${d.name} ($${d.value}, Status: ${d.stage})`).join(', ')}.
            Recent Invoices: ${clientData.invoices.map(i => `Invoice ${i.invoice_number} ($${i.total_amount}, Status: ${i.status})`).join(', ')}.
        `;

        const prompt = `You are an AI business assistant for a company that provides: "${userCompanyDescription}". 
            Based on the following client history, suggest a single, concise "Next Best Action" to take with this client. 
            Frame it as a clear, actionable suggestion. For example: "Follow up on the recent proposal" or "Offer a retainer for ongoing work".
            Client History: ${historySummary}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        clientData.nextBestAction = completion.choices[0].message.content.trim();

        res.status(200).json(clientData);

    } catch (err) {
        console.error('Error fetching client details:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: Endpoint specifically for the CRM to get a list of all clients
app.get('/api/crm/clients', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const query = `
            SELECT 
                c.id, 
                c.name, 
                c.email, 
                c.company_name AS "companyName",
                COUNT(sd.id) AS deal_count,
                COALESCE(SUM(CASE WHEN sd.stage = 'Closed Won' THEN sd.value ELSE 0 END), 0) AS total_value
            FROM clients c
            LEFT JOIN sales_deals sd ON c.id = sd.client_id
            WHERE c.user_id = $1
            GROUP BY c.id
            ORDER BY c.name ASC;
        `;
        const clients = await pool.query(query, [userId]);
        res.status(200).json(clients.rows);
    } catch (err) {
        console.error('Error fetching CRM client list:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: Endpoint to get all details for a single client
app.get('/api/crm/clients/:id', authenticateToken, async (req, res) => {
    const { id: clientId } = req.params;
    const { userId } = req.user;
    let userCompanyDescription = '';

    try {
        // Fetch user's company description for the AI prompt
        const userRes = await pool.query('SELECT company_description FROM users WHERE id = $1', [userId]);
        if (userRes.rows.length > 0) {
            userCompanyDescription = userRes.rows[0].company_description;
        }

        // Fetch all client data concurrently
        const [clientRes, dealsRes, invoicesRes] = await Promise.all([
            pool.query('SELECT id, name, email, phone_number AS "phoneNumber", company_name AS "companyName" FROM clients WHERE id = $1 AND user_id = $2', [clientId, userId]),
            pool.query('SELECT * FROM sales_deals WHERE client_id = $1 AND user_id = $2 ORDER BY created_at DESC', [clientId, userId]),
            pool.query('SELECT * FROM invoices WHERE client_id = $1 AND user_id = $2 ORDER BY created_at DESC', [clientId, userId])
        ]);

        if (clientRes.rows.length === 0) {
            return res.status(404).json({ message: 'Client not found.' });
        }

        const clientData = {
            details: clientRes.rows[0],
            deals: dealsRes.rows,
            invoices: invoicesRes.rows,
        };

        // --- AI Next Best Action ---
        const historySummary = `
            Recent Deals: ${clientData.deals.map(d => `${d.name} ($${d.value}, Status: ${d.stage})`).join(', ')}.
            Recent Invoices: ${clientData.invoices.map(i => `Invoice ${i.invoice_number} ($${i.total_amount}, Status: ${i.status})`).join(', ')}.
        `;

        const prompt = `You are an AI business assistant for a company that provides: "${userCompanyDescription}". 
            Based on the following client history, suggest a single, concise "Next Best Action" to take with this client. 
            Frame it as a clear, actionable suggestion. For example: "Follow up on the recent proposal" or "Offer a retainer for ongoing work".
            Client History: ${historySummary}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        clientData.nextBestAction = completion.choices[0].message.content.trim();

        res.status(200).json(clientData);

    } catch (err) {
        console.error('Error fetching client details:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all sales deals for the logged-in user, now with client info.
app.get('/api/sales/deals', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const deals = await pool.query(`
            SELECT 
                sd.*, 
                c.name AS client_name, 
                c.email AS client_email, 
                c.company_name AS client_company 
            FROM sales_deals sd
            JOIN clients c ON sd.client_id = c.id
            WHERE sd.user_id = $1
            ORDER BY sd.created_at DESC
        `, [userId]);
        res.status(200).json(deals.rows);
    } catch (err) {
        console.error('Error fetching sales data:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new deal for the logged-in user
app.post('/api/sales/deals', authenticateToken, async (req, res) => {
    const { name, value, stage, client_id } = req.body;
    const { userId } = req.user;
    try {
        const newDealResult = await pool.query(
            'INSERT INTO sales_deals (user_id, client_id, name, value, stage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, client_id, name, value, stage]
        );
        const newDeal = newDealResult.rows[0];

        // ➡️ AUTOMATION: If it's a new lead, create a follow-up task.
        if (stage === 'New Leads') {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 1); // Due in 24 hours
            await pool.query(
                'INSERT INTO tasks (user_id, title, priority, due_date) VALUES ($1, $2, $3, $4)',
                [userId, `Initial follow-up for deal: ${name}`, 'High', dueDate]
            );
        }

        res.status(201).json(newDeal);
    } catch (err) {
        console.error('Error adding new deal:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT (update) an existing deal
// Replace the entire PUT /api/sales/deals/:dealId route in server.js

// Replace in server/server.js

// Replace the entire PUT /api/sales/deals/:dealId route in server.js

// Replace in server/server.js

app.put('/api/sales/deals/:dealId', authenticateToken, async (req, res) => {
    const { dealId } = req.params;
    const { name, value, stage, client_id } = req.body;
    const { userId } = req.user;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const userRes = await client.query('SELECT plan_type, free_automations_used, subscription_status, trial_ends_at FROM users WHERE id = $1', [userId]);
        const userPlan = userRes.rows[0];
        const isTrialActive = userPlan.subscription_status === 'trialing' && new Date(userPlan.trial_ends_at) > new Date();
        const hasActiveSub = userPlan.subscription_status === 'active';
        
        const originalDealRes = await client.query('SELECT stage FROM sales_deals WHERE id = $1 AND user_id = $2', [dealId, userId]);
        if (originalDealRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Deal not found.' });
        }
        const originalStage = originalDealRes.rows[0].stage;

        const updatedDealResult = await client.query(
            'UPDATE sales_deals SET name = $1, value = $2, stage = $3, updated_at = CURRENT_TIMESTAMP, client_id = $4 WHERE id = $5 AND user_id = $6 RETURNING id',
            [name, value, stage, client_id, dealId, userId]
        );
        
        const updatedDealId = updatedDealResult.rows[0].id;
        let next_actions = [];
        let automation_result = null;

              if (stage === 'Closed Won' && originalStage !== 'Closed Won') {
            // Check if the user is eligible for automations
            if (hasActiveSub || isTrialActive) {
                // Check if it's the "one free taste" for free plan users
                if (userPlan.plan_type === 'free' && userPlan.free_automations_used < 1) {
                    await client.query('UPDATE users SET free_automations_used = free_automations_used + 1 WHERE id = $1', [userId]);
                    await client.query('INSERT INTO tasks (user_id, title, priority) VALUES ($1, $2, $3)', [userId, `Onboard new client: ${name}`, 'High']);
                    automation_result = { status: 'success_one_time_freebie', message: `We've created an onboarding task for ${name} automatically this time!` };
                } else if (userPlan.plan_type === 'free') {
                    // They've used their freebie, show the teaser
                    automation_result = { status: 'teaser', message: 'Upgrade to automate this.' };
                    next_actions = [
                        { type: 'create_onboarding_task', label: 'Create Onboarding Task' },
                        { type: 'send_welcome_email', label: 'Draft Welcome Email' }
                    ];
                } else {
                    // They are on a paid plan, show the full prompt
                    next_actions = [
                        { type: 'create_onboarding_task', label: 'Create Onboarding Task' },
                        { type: 'send_welcome_email', label: 'Draft Welcome Email' }
                    ];
                }
            }
        }

        await client.query('COMMIT');

        
        // CHANGE: Fetch the full deal data WITH the client name to send back to the frontend
        const fullDealDataRes = await client.query(
            `SELECT sd.*, c.name as client_name 
             FROM sales_deals sd
             JOIN clients c ON sd.client_id = c.id
             WHERE sd.id = $1`,
            [updatedDealId]
        );
        const fullDealData = fullDealDataRes.rows[0];

        
         res.status(200).json({ deal: fullDealData, next_actions, automation_result });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating deal:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});


// DELETE a deal
app.delete('/api/sales/deals/:dealId', authenticateToken, async (req, res) => {
    const { dealId } = req.params;
    const { userId } = req.user;
    try {
        const result = await pool.query('DELETE FROM sales_deals WHERE id = $1 AND user_id = $2', [dealId, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Deal not found or user not authorized.' });
        }
        res.status(200).json({ message: 'Deal deleted successfully.' });
    } catch (err) {
        console.error('Error deleting deal:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new note to a specific deal
app.post('/api/sales/deals/:dealId/notes', authenticateToken, async (req, res) => {
    const { dealId } = req.params;
    const { note, type } = req.body;
    const { userId } = req.user;
    try {
        const dealResult = await pool.query('SELECT id FROM sales_deals WHERE id = $1 AND user_id = $2', [dealId, userId]);
        if (dealResult.rows.length === 0) {
            return res.status(404).json({ message: 'Deal not found or user not authorized.' });
        }
        const newNote = await pool.query(
            'INSERT INTO deal_notes (deal_id, user_id, note, type) VALUES ($1, $2, $3, $4) RETURNING *',
            [dealId, userId, note, type]
        );
        res.status(201).json(newNote.rows[0]);
    } catch (err) {
        console.error('Error adding new note to deal:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// =========================================================================
// AI INTEGRATION ROUTES
// =========================================================================

// POST endpoint for AI to generate a sales email
app.post('/api/ai/generate-email', authenticateToken, async (req, res) => {
    const { emailType, clientName, clientCompany } = req.body;
    const { companyDescription, name } = req.user;

    const prompts = {
        'outreach': `Generate a sales outreach email from a business owner to a potential client. The business owner's name is "${name}" and their business provides the following services: "${companyDescription}". The potential client's name is "${clientName}" at "${clientCompany}". The email should be professional, concise, and focused on providing value, not just selling. Include a clear call to action. Do not include a signature.`,
        'follow-up': `Generate a follow-up email from a business owner named "${name}" who offers services in: "${companyDescription}". This is to follow up with a potential client named "${clientName}" from "${clientCompany}". The tone should be polite and value-focused. Do not include a signature.`,
        'value-added': `Generate an email from a business owner named "${name}" who provides services in: "${companyDescription}". This email should provide value-added content (e.g., a helpful tip, industry insight, or free resource) to a potential client named "${clientName}" from "${clientCompany}". Do not include a signature.`,
        'closing-sequence': `Draft a concise closing sequence email to be sent to a client to finalize a deal. The sender is "${name}" from "${req.user.company}". The recipient is "${clientName}" from "${clientCompany}". The email should be professional, congratulatory, and clearly outline the next steps for a smooth closing, such as contract signing or payment. Do not include a signature.`
    };

    const prompt = prompts[emailType];
    if (!prompt) {
        return res.status(400).json({ message: 'Invalid email type specified.' });
    }
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const generatedText = completion.choices[0].message.content.trim();
        res.status(200).json({ emailContent: generatedText });
    } catch (err) {
        console.error('Error generating sales email:', err);
        res.status(500).json({ message: 'Error generating email. Please ensure your OpenAI API key is valid and your plan is active.' });
    }
});

// POST endpoint for AI to generate sales leads
app.post('/api/ai/generate-leads', authenticateToken, async (req, res) => {
    const { companyDescription, name } = req.user;
    let userLocation = 'Calgary, Canada'; // Default location

    try {
        const ipResponse = await axios.get('http://ip-api.com/json');
        const locationData = ipResponse.data;
        if (locationData.status === 'success' && locationData.city && locationData.country) {
            userLocation = `${locationData.city}, ${locationData.country}`;
        }
    } catch (ipErr) {
        console.error('Could not get user IP location, using default:', ipErr);
    }
    
    const prompt = `You are a lead generation assistant. The user is a business owner named "${name}" whose business is described as: "${companyDescription}". Their location is approximately "${userLocation}". Generate a list of five potential leads or lead ideas for this business. Provide a brief description for each lead idea. The response should be a simple list.`;
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const generatedText = completion.choices[0].message.content.trim();
        res.status(200).json({ leads: generatedText.split('\n').filter(line => line.trim() !== '') });
    } catch (err) {
        console.error('Error generating leads:', err);
        res.status(500).json({ message: 'Error generating leads. Please ensure your OpenAI API key is valid.' });
    }
});


// POST endpoint to send a generated email to a client.
app.post('/api/sales/send-email', authenticateToken, async (req, res) => {
    const { clientEmail, subject, body, clientId } = req.body;
    // ➡️ UPDATED: Removed unused 'name' and 'company' variables
    const { userId } = req.user;

    if (!clientEmail || !subject || !body || !clientId) {
        return res.status(400).json({ message: 'Client email, subject, body, and client ID are required.' });
    }

    try {
        const clientResult = await pool.query('SELECT email FROM clients WHERE id = $1 AND user_id = $2', [clientId, userId]);
        if (clientResult.rows.length === 0) {
            return res.status(404).json({ message: 'Client not found or user not authorized.' });
        }

        const msg = {
            to: clientEmail,
            from: 'dami@cytrustadvisory.ca', // This must be a verified sender in your SendGrid account.
            subject: subject,
            html: body
        };

        await sgMail.send(msg);

        await pool.query(
            'INSERT INTO deal_notes (deal_id, user_id, note, type) VALUES ($1, $2, $3, $4) RETURNING *',
            [null, userId, body, 'sent-email']
        );

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
        console.error('Error sending email:', err);
        if (err.response) {
            console.error(err.response.body);
            return res.status(err.response.statusCode).json({ message: 'Failed to send email. Check SendGrid status.' });
        }
        res.status(500).json({ message: 'Server error while sending email.' });
    }
});

// ➡️ NEW: POST endpoint for AI to summarize text
app.post('/api/ai/summarize', authenticateToken, async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: 'Text to summarize is required.' });
    }

    const prompt = `Please summarize the following document concisely and effectively, extracting the key points:\n\n---\n\n${text}`;
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const summary = completion.choices[0].message.content.trim();
        res.status(200).json({ summary });
    } catch (err) {
        console.error('Error generating summary:', err);
        res.status(500).json({ message: 'Error generating summary. Please ensure your OpenAI API key is valid.' });
    }
});

// ➡️ NEW: POST endpoint for AI to draft a general-purpose email
app.post('/api/ai/draft-email', authenticateToken, async (req, res) => {
    const { prompt } = req.body;
    const { name } = req.user; // Get the user's name from the token

    if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ message: 'A prompt for the email is required.' });
    }

    const fullPrompt = `An AI assistant is drafting an email for a user named "${name}". Based on the user's request, generate a professional and clear email body. Do not include a subject line or a signature block, only the body of the email. User's request: "${prompt}"`;
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: fullPrompt }],
        });

        const emailBody = completion.choices[0].message.content.trim();
        res.status(200).json({ emailBody });
    } catch (err) {
        console.error('Error drafting email:', err);
        res.status(500).json({ message: 'Error drafting email. Please ensure your OpenAI API key is valid.' });
    }
});

// ➡️ NEW: VIRTUAL ASSISTANT (TASKS) API ROUTES
// =========================================================================

// GET all non-deleted tasks for the logged-in user
app.get('/api/tasks', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const tasks = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 AND is_deleted = FALSE ORDER BY status ASC, due_date ASC NULLS LAST, created_at DESC', 
            [userId]
        );
        res.status(200).json(tasks.rows);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new task for the logged-in user
app.post('/api/tasks', authenticateToken, async (req, res) => {
    const { title, priority, dueDate } = req.body;
    const { userId } = req.user;
    try {
        const newTask = await pool.query(
            'INSERT INTO tasks (user_id, title, priority, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, title, priority, dueDate]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error('Error adding new task:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT (update) an existing task
app.put('/api/tasks/:taskId', authenticateToken, async (req, res) => {
    const { taskId } = req.params;
    const { title, priority, dueDate, status } = req.body;
    const { userId } = req.user;
    try {
        const updatedTask = await pool.query(
            'UPDATE tasks SET title = $1, priority = $2, due_date = $3, status = $4 WHERE id = $5 AND user_id = $6 AND is_deleted = FALSE RETURNING *',
            [title, priority, dueDate, status, taskId, userId]
        );
        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found or user not authorized.' });
        }
        res.status(200).json(updatedTask.rows[0]);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➡️ UPDATED: DELETE a task (soft delete) by setting is_deleted to true
app.delete('/api/tasks/:taskId', authenticateToken, async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.user;
    try {
        const result = await pool.query(
            'UPDATE tasks SET is_deleted = TRUE WHERE id = $1 AND user_id = $2',
            [taskId, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Task not found or user not authorized.' });
        }
        res.status(200).json({ message: 'Task moved to trash.' });
    } catch (err) {
        console.error('Error soft-deleting task:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➡️ NEW: GET all trashed tasks
app.get('/api/tasks/trash', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1 AND is_deleted = TRUE ORDER BY created_at DESC', [userId]);
        res.status(200).json(tasks.rows);
    } catch (err) {
        console.error('Error fetching trashed tasks:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➡️ NEW: PUT to restore a task from the trash
app.put('/api/tasks/:taskId/restore', authenticateToken, async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.user;
    try {
        const result = await pool.query('UPDATE tasks SET is_deleted = FALSE WHERE id = $1 AND user_id = $2', [taskId, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Task not found in trash or user not authorized.' });
        }
        res.status(200).json({ message: 'Task restored successfully.' });
    } catch (err) {
        console.error('Error restoring task:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➡️ NEW: This endpoint purges tasks from the trash older than 30 days.
// This would ideally be called by a scheduled cron job.
app.delete('/api/tasks/trash/purge', authenticateToken, async (req, res) => {
    const { userId } = req.user; // Can be adapted for admin use later
    try {
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
        const result = await pool.query(
            'DELETE FROM tasks WHERE is_deleted = TRUE AND created_at < $1 AND user_id = $2',
            [thirtyDaysAgo, userId]
        );
        res.status(200).json({ message: `Purged ${result.rowCount} old tasks from the trash.` });
    } catch (err) {
        console.error('Error purging old tasks:', err);
        res.status(500).json({ message: 'Server error during task purge.' });
    }
});


// ➡️ NEW: DELETE a task permanently from the trash
app.delete('/api/tasks/:taskId/permanent', authenticateToken, async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.user;
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 AND is_deleted = TRUE', [taskId, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Task not found in trash or user not authorized.' });
        }
        res.status(200).json({ message: 'Task permanently deleted.' });
    } catch (err) {
        console.error('Error permanently deleting task:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➡️ NEW: GET notifications for overdue and upcoming tasks
app.get('/api/notifications', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const now = new Date();
        const notifications = await pool.query(
            `SELECT id, title, due_date, 
             CASE 
               WHEN due_date < $2 THEN 'overdue'
               ELSE 'due_today'
             END as type
             FROM tasks 
             WHERE user_id = $1 AND is_deleted = FALSE AND status = 'incomplete' AND due_date::date <= $2::date`,
            [userId, now]
        );
        res.status(200).json(notifications.rows);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➡️ NEW: FINANCE API ROUTES
// =========================================================================

// POST a new transaction
app.post('/api/transactions', authenticateToken, async (req, res) => {
    const { title, amount, type, category, transaction_date } = req.body;
    const { userId } = req.user;
    try {
        const newTransaction = await pool.query(
            'INSERT INTO transactions (user_id, title, amount, type, category, transaction_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, title, amount, type, category, transaction_date]
        );
        res.status(201).json(newTransaction.rows[0]);
    } catch (err) {
        console.error('Error adding transaction:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET a summary of financial data
// In server.js, replace the entire app.get('/api/finance/summary', ...) block

app.get('/api/finance/summary', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { period = 'monthly' } = req.query;

    // ➡️ UPDATED: Added 'intervalUnit' to ensure correct pluralization for SQL
    let dateTrunc, interval, dateFormat, timePeriod, intervalUnit;
    switch (period) {
        case 'daily': 
            dateTrunc = 'day'; 
            interval = '1 day';
            timePeriod = 30;
            intervalUnit = 'days'; // Plural
            dateFormat = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            break;
        case 'weekly': 
            dateTrunc = 'week';
            interval = '1 week';
            timePeriod = 12;
            intervalUnit = 'weeks'; // Plural
            dateFormat = (dateStr) => {
                const startOfWeek = new Date(dateStr);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { day: 'numeric' })}`;
            };
            break;
        case 'quarterly': 
            dateTrunc = 'quarter';
            interval = '3 months';
            timePeriod = 4;
            intervalUnit = 'quarters'; // Plural
            dateFormat = (date) => `Q${Math.floor((new Date(date).getMonth() + 3) / 3)} ${new Date(date).getFullYear()}`;
            break;
        case 'yearly': 
            dateTrunc = 'year';
            interval = '1 year';
            timePeriod = 5;
            intervalUnit = 'years'; // Plural
            dateFormat = (date) => new Date(date).getFullYear();
            break;
        default: 
            dateTrunc = 'month';
            interval = '1 month';
            timePeriod = 12;
            intervalUnit = 'months'; // Plural
            dateFormat = (date) => new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' });
    }

    try {
        const metricsQuery = await pool.query(`SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income, COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses FROM transactions WHERE user_id = $1`, [userId]);
        const { total_income, total_expenses } = metricsQuery.rows[0];
        const net_profit = total_income - total_expenses;
        const burn_rate = total_expenses > total_income ? (total_expenses - total_income) / 12 : 0;
        const runway = burn_rate > 0 ? total_income / burn_rate : Infinity;

        const recentTransactionsQuery = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC LIMIT 5', [userId]);

        // ➡️ UPDATED: The INTERVAL now uses the corrected plural 'intervalUnit'
        const chartQuery = await pool.query(
            `WITH date_series AS (
                SELECT generate_series(
                    DATE_TRUNC('${dateTrunc}', NOW() - INTERVAL '${timePeriod - 1} ${intervalUnit}'),
                    DATE_TRUNC('${dateTrunc}', NOW()),
                    '${interval}'
                )::DATE AS period_start
            ),
            transaction_data AS (
                SELECT 
                    DATE_TRUNC('${dateTrunc}', transaction_date)::DATE as period_start, 
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income, 
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses 
                FROM transactions 
                WHERE user_id = $1 
                GROUP BY period_start
            )
            SELECT 
                ds.period_start,
                COALESCE(td.income, 0) as income,
                COALESCE(td.expenses, 0) as expenses
            FROM date_series ds
            LEFT JOIN transaction_data td ON ds.period_start = td.period_start
            ORDER BY ds.period_start ASC`,
            [userId]
        );

        res.status(200).json({
            metrics: {
                netProfit: parseFloat(net_profit).toFixed(2),
                burnRate: parseFloat(burn_rate).toFixed(2),
                runway: isFinite(runway) ? Math.floor(runway) : 'Infinite'
            },
            recentTransactions: recentTransactionsQuery.rows,
            chartData: chartQuery.rows.map(row => ({
                name: dateFormat(row.period_start),
                income: parseFloat(row.income),
                expenses: parseFloat(row.expenses)
            }))
        });
    } catch (err) {
        console.error('Error fetching finance summary:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a transaction
app.delete('/api/transactions/:transactionId', authenticateToken, async (req, res) => {
    const { transactionId } = req.params;
    const { userId } = req.user;
    try {
        const result = await pool.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [transactionId, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Transaction not found or not authorized.' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➡️ NEW: AI endpoint for financial analysis
app.post('/api/ai/analyze-finances', authenticateToken, async (req, res) => {
    const { summary } = req.body; // Expecting summary data from the frontend
    if (!summary) {
        return res.status(400).json({ message: 'Financial summary is required.' });
    }

    const prompt = `As an AI financial advisor for a freelancer or small business owner, analyze the following financial summary and provide three clear, actionable insights or tips. Focus on improving profitability, cutting unnecessary costs, or identifying growth opportunities. The user's financial summary is:
    - Total Income: $${summary.metrics.netProfit > 0 ? summary.metrics.netProfit : 'N/A'}
    - Total Expenses: $${summary.metrics.burnRate > 0 ? summary.metrics.burnRate * 12 : 'N/A'}
    - Top Expense Categories (if available): ${summary.topExpenses?.join(', ') || 'Not provided'}
    
    Provide the response as a simple, easy-to-read list.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        const analysis = completion.choices[0].message.content.trim();
        res.status(200).json({ analysis });
    } catch (err) {
        console.error('Error analyzing finances:', err);
        res.status(500).json({ message: 'Error analyzing finances.' });
    }
});

// ➡️ NEW: MARKETING API ROUTES
// =========================================================================

// GET marketing summary data (metrics and campaigns)
app.get('/api/marketing/summary', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const metricsQuery = await pool.query(
            `SELECT 
                COALESCE(SUM(reach), 0) as total_reach,
                COALESCE(SUM(engagement), 0) as total_engagement,
                COALESCE(SUM(conversions), 0) as total_conversions,
                COALESCE(SUM(ad_spend), 0) as total_ad_spend
             FROM campaigns WHERE user_id = $1`,
            [userId]
        );

        const campaignsQuery = await pool.query('SELECT * FROM campaigns WHERE user_id = $1 ORDER BY start_date DESC', [userId]);

        const engagementRate = metricsQuery.rows[0].total_reach > 0 ? (metricsQuery.rows[0].total_engagement / metricsQuery.rows[0].total_reach * 100).toFixed(1) : 0;

        res.status(200).json({
            metrics: {
                ...metricsQuery.rows[0],
                engagementRate
            },
            campaigns: campaignsQuery.rows
        });
    } catch (err) {
        console.error('Error fetching marketing summary:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new campaign
app.post('/api/campaigns', authenticateToken, async (req, res) => {
    const { name, platform, ad_spend, reach, engagement, conversions, start_date, end_date } = req.body;
    const { userId } = req.user;
    try {
        const newCampaign = await pool.query(
            'INSERT INTO campaigns (user_id, name, platform, ad_spend, reach, engagement, conversions, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [userId, name, platform, ad_spend, reach, engagement, conversions, start_date, end_date]
        );
        res.status(201).json(newCampaign.rows[0]);
    } catch (err) {
        console.error('Error adding campaign:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET content calendar entries
app.get('/api/content-calendar', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const content = await pool.query('SELECT * FROM content_calendar WHERE user_id = $1 ORDER BY post_date ASC', [userId]);
        res.status(200).json(content.rows);
    } catch (err) {
        console.error('Error fetching content calendar:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new content calendar entry
app.post('/api/content-calendar', authenticateToken, async (req, res) => {
    const { post_text, platform, status, post_date } = req.body;
    const { userId } = req.user;
    try {
        const newContent = await pool.query(
            'INSERT INTO content_calendar (user_id, post_text, platform, status, post_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, post_text, platform, status, post_date]
        );
        res.status(201).json(newContent.rows[0]);
    } catch (err) {
        console.error('Error adding content:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➡️ NEW: AI endpoint for generating post ideas
app.post('/api/ai/generate-post-idea', authenticateToken, async (req, res) => {
    const { topic, tone } = req.body;
    const { companyDescription } = req.user;

    if (!topic) {
        return res.status(400).json({ message: 'A topic is required.' });
    }

    const prompt = `You are an AI social media assistant for a business described as: "${companyDescription}". Generate a social media post about "${topic}". The tone should be ${tone || 'professional'}. Provide only the text for the post.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        const postIdea = completion.choices[0].message.content.trim();
        res.status(200).json({ postIdea });
    } catch (err) {
        console.error('Error generating post idea:', err);
        res.status(500).json({ message: 'Error generating post idea.' });
    }
});

// ➡️ NEW: MAIN DASHBOARD API ROUTE
// =========================================================================
app.get('/api/dashboard/overview', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        // CHANGE: Placed pool.query calls directly inside Promise.all to resolve linting warnings.
        const [salesResult, tasksResult, financeMTDResult, financeWeeklyResult] = await Promise.all([
            pool.query(`SELECT COUNT(*) as open_deals, COALESCE(SUM(value), 0) as pipeline_value FROM sales_deals WHERE user_id = $1 AND stage != 'Closed Won' AND stage != 'Closed Lost'`, [userId]),
            pool.query(`SELECT COUNT(*) as upcoming_tasks FROM tasks WHERE user_id = $1 AND status = 'incomplete' AND due_date >= NOW() AND is_deleted = FALSE`, [userId]),
            pool.query(`SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as net_profit_mtd FROM transactions WHERE user_id = $1 AND transaction_date >= DATE_TRUNC('month', NOW())`, [userId]),
            pool.query(`
                SELECT 
                    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as weekly_revenue,
                    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as weekly_expenses
                FROM transactions 
                WHERE user_id = $1 AND transaction_date >= DATE_TRUNC('week', NOW())
            `, [userId])
        ]);

        const pipelineValue = parseFloat(salesResult.rows[0].pipeline_value);
        const netProfitMTD = parseFloat(financeMTDResult.rows[0].net_profit_mtd);
        const weeklyRevenue = parseFloat(financeWeeklyResult.rows[0].weekly_revenue);
        const weeklyExpenses = parseFloat(financeWeeklyResult.rows[0].weekly_expenses);
        const weeklyCashFlow = weeklyRevenue - weeklyExpenses;

        // Business Health Score Calculation
        const profitScore = Math.min(Math.max(netProfitMTD / 5000, 0), 1) * 50;
        const pipelineScore = Math.min(Math.max(pipelineValue / 10000, 0), 1) * 30;
        const taskScore = Math.max(1 - (parseInt(tasksResult.rows[0].upcoming_tasks) / 10), 0) * 20;
        const healthScore = Math.round(profitScore + pipelineScore + taskScore);

        res.status(200).json({
            openDeals: salesResult.rows[0].open_deals || 0,
            pipelineValue: pipelineValue.toFixed(2),
            upcomingTasks: tasksResult.rows[0].upcoming_tasks || 0,
            netProfitMTD: netProfitMTD.toFixed(2),
            healthScore: healthScore,
            weeklyRevenue: weeklyRevenue.toFixed(2),
            weeklyExpenses: weeklyExpenses.toFixed(2),
            weeklyCashFlow: weeklyCashFlow.toFixed(2),
            recommendations: [
                { id: 1, text: "You could save ~$150/mo by consolidating software subscriptions.", icon: "💡" },
                { id: 2, text: "Enable automatic invoice reminders to get paid 3 days faster on average.", icon: "🔔" },
                { id: 3, text: "Your sales pipeline is strong. Consider creating a new marketing campaign to add more leads.", icon: "🚀" }
            ]
        });
    } catch (err) {
        console.error('Error fetching dashboard overview:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/dashboard/recent-activity', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const query = `
            SELECT 'DEAL' as type, sd.name as description, sd.stage as status, sd.value as amount, sd.created_at as timestamp
            FROM sales_deals sd WHERE sd.user_id = $1
            UNION ALL
            SELECT 'TASK' as type, t.title as description, t.status as status, NULL as amount, t.created_at as timestamp
            FROM tasks t WHERE t.user_id = $1 AND t.is_deleted = FALSE
            UNION ALL
            SELECT 'INVOICE' as type, CONCAT('Invoice ', i.invoice_number, ' to ', c.name) as description, i.status as status, i.total_amount as amount, i.created_at as timestamp
            FROM invoices i JOIN clients c ON i.client_id = c.id WHERE i.user_id = $1
            ORDER BY timestamp DESC
            LIMIT 10;
        `;
        const activityResult = await pool.query(query, [userId]);
        res.status(200).json(activityResult.rows);
    } catch (err) {
        console.error('Error fetching recent activity:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: AI endpoint to generate a dynamic status message based on health score
app.post('/api/ai/status-message', authenticateToken, async (req, res) => {
    const { healthScore } = req.body;
    if (healthScore === undefined) {
        return res.status(400).json({ message: 'Health score is required.' });
    }

    const prompt = `Based on a business health score of ${healthScore} out of 100, generate a short, single-sentence status message for a business owner. 
        - If the score is high (75-100), be positive and encouraging (e.g., Your business is on track for an excellent month!).
        - If it's mid-range (50-74), be motivating (e.g., Things are looking steady. Keep up the momentum!).
        - If it's low (0-49), be supportive and gently suggest focus (e.g., Let's focus on a few key areas to boost performance.).
        Keep it concise.`;
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        const message = completion.choices[0].message.content.trim();
        res.status(200).json({ message });
    } catch (err) {
        console.error('Error generating AI status message:', err);
        res.status(500).json({ message: "Here's your business at a glance." }); // Fallback message
    }
});


// ➡️ NEW: INVOICING API ROUTES
// =========================================================================

// GET all invoices with search
app.get('/api/invoices', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { search = '' } = req.query;
    try {
        const query = `
            SELECT i.*, c.name as client_name 
            FROM invoices i
            JOIN clients c ON i.client_id = c.id
            WHERE i.user_id = $1 
            AND (c.name ILIKE $2 OR i.invoice_number ILIKE $2)
            ORDER BY i.issue_date DESC`;
        const invoices = await pool.query(query, [userId, `%${search}%`]);
        res.status(200).json(invoices.rows);
    } catch (err) {
        console.error('Error fetching invoices:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET a single invoice with its line items
app.get('/api/invoices/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const invoiceRes = await pool.query('SELECT i.*, c.name as client_name, c.email as client_email FROM invoices i JOIN clients c ON i.client_id = c.id WHERE i.id = $1 AND i.user_id = $2', [id, userId]);
        if (invoiceRes.rows.length === 0) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        const lineItemsRes = await pool.query('SELECT * FROM invoice_line_items WHERE invoice_id = $1', [id]);
        
        const invoice = invoiceRes.rows[0];
        invoice.lineItems = lineItemsRes.rows;
        
        res.status(200).json(invoice);
    } catch (err) {
        console.error('Error fetching single invoice:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: Endpoint to create a Stripe Checkout session for an invoice
app.post('/api/invoices/:id/create-checkout-session', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        // 1. Fetch the invoice from your database to get the correct amount
        const invoiceRes = await pool.query(
            'SELECT i.total_amount, i.invoice_number, c.name as client_name FROM invoices i JOIN clients c ON i.client_id = c.id WHERE i.id = $1 AND i.user_id = $2',
            [id, userId]
        );

        if (invoiceRes.rows.length === 0) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        const invoice = invoiceRes.rows[0];

        // 2. Create a Checkout Session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd', // You can change this to your desired currency
                    product_data: {
                        name: `Payment for Invoice ${invoice.invoice_number}`,
                        description: `Client: ${invoice.client_name}`,
                    },
                    // Stripe requires the amount in the smallest currency unit (e.g., cents)
                    unit_amount: Math.round(invoice.total_amount * 100),
                },
                quantity: 1,
            }],
            // These are the URLs Stripe will redirect to after payment
            success_url: `${process.env.FRONTEND_URL}?payment_success=true&invoice_id=${id}`,
            cancel_url: `${process.env.FRONTEND_URL}/finance?payment_cancelled=true`,
        });

        // 3. Send the session URL back to the frontend
        res.status(200).json({ url: session.url });

    } catch (err) {
        console.error('Error creating Stripe session:', err);
        res.status(500).json({ message: 'Server error while creating payment session.' });
    }
});


// ➡️ UPDATED: Invoice creation now handles tax_rate
app.post('/api/invoices', authenticateToken, async (req, res) => {
    const { client_id, issue_date, due_date, notes, lineItems, invoice_number, tax_rate } = req.body;
    const { userId } = req.user;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const subtotal = lineItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
        const taxAmount = subtotal * (parseFloat(tax_rate || 0) / 100);
        const total_amount = subtotal + taxAmount;
        
        const final_invoice_number = invoice_number || `INV-${Date.now()}`;
        const invoiceQuery = `INSERT INTO invoices (user_id, client_id, invoice_number, issue_date, due_date, total_amount, notes, status, tax_rate, tax_amount) VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', $8, $9) RETURNING id`;
        const invoiceRes = await client.query(invoiceQuery, [userId, client_id, final_invoice_number, issue_date, due_date, total_amount, notes, tax_rate || 0, taxAmount]);
        const invoiceId = invoiceRes.rows[0].id;
        for (const item of lineItems) {
            const lineItemQuery = `INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, total) VALUES ($1, $2, $3, $4, $5)`;
            await client.query(lineItemQuery, [invoiceId, item.description, item.quantity, item.unit_price, item.total]);
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Invoice created successfully', invoiceId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating invoice:', err);
        res.status(500).json({ message: 'Server error while creating invoice' });
    } finally {
        client.release();
    }
});

// PUT to update an invoice (e.g., change invoice number)
app.put('/api/invoices/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { invoice_number } = req.body;
    const { userId } = req.user;
    try {
        const result = await pool.query('UPDATE invoices SET invoice_number = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [invoice_number, id, userId]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Invoice not found' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating invoice:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT to update an invoice status (e.g., mark as sent or paid)
app.put('/api/invoices/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { userId } = req.user;
    try {
        const result = await pool.query('UPDATE invoices SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [status, id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        // If marked as paid, create a corresponding transaction
        if (status === 'paid') {
            const invoice = result.rows[0];
            await pool.query(
                'INSERT INTO transactions (user_id, title, amount, type, category, transaction_date) VALUES ($1, $2, $3, $4, $5, $6)',
                [userId, `Payment for Invoice ${invoice.invoice_number}`, invoice.total_amount, 'income', 'Invoice Payment', new Date()]
            );
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating invoice status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/invoices/:id/download', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const pdfBuffer = await generateInvoicePDF(id, userId);
        const invoiceRes = await pool.query('SELECT invoice_number FROM invoices WHERE id = $1', [id]);
        const fileName = invoiceRes.rows[0]?.invoice_number || `invoice-${id}`;

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (err) {
        console.error('Error generating PDF for download:', err);
        res.status(500).send('Could not generate PDF.');
    }
});

// POST endpoint to send an invoice via email
app.post('/api/invoices/:id/send', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const invoiceRes = await pool.query('SELECT i.invoice_number, c.name as client_name, c.email as client_email FROM invoices i JOIN clients c ON i.client_id = c.id WHERE i.id = $1 AND i.user_id = $2', [id, userId]);
        if (invoiceRes.rows.length === 0) return res.status(404).json({ message: 'Invoice not found' });
        
        const invoice = invoiceRes.rows[0];
        const userRes = await pool.query('SELECT name, company FROM users WHERE id = $1', [userId]);
        const user = userRes.rows[0];

        // Use the new helper function to generate the PDF
        const pdfBuffer = await generateInvoicePDF(id, userId);
        const pdfBase64 = pdfBuffer.toString('base64');

        const msg = {
            to: invoice.client_email,
            from: 'dami@cytrustadvisory.ca', // This must be a verified sender in your SendGrid account
            subject: `Invoice ${invoice.invoice_number} from ${user.company || user.name}`,
            html: `<p>Hello ${invoice.client_name},</p><p>Please find your invoice attached.</p><p>Thank you for your business!</p>`,
            attachments: [{
                content: pdfBase64,
                filename: `${invoice.invoice_number}.pdf`,
                type: 'application/pdf',
                disposition: 'attachment'
            }],
        };
        await sgMail.send(msg);

        await pool.query(`UPDATE invoices SET status = 'sent' WHERE id = $1 AND user_id = $2`, [id, userId]);
        res.status(200).json({ message: 'Invoice sent successfully!' });
    } catch (err) {
        console.error('Error sending invoice:', err);
        res.status(500).json({ message: 'Server error while sending invoice' });
    }
});

// ➡️ AUTOMATION: New endpoint for sending invoice reminders.
// This should be triggered by a scheduled job (e.g., a cron job) running once a day.
app.post('/api/invoices/send-reminders', async (req, res) => {
    // Optional: Add a secret key check for security
    // const { secret } = req.body;
    // if (secret !== process.env.AUTOMATION_SECRET) return res.sendStatus(401);

    try {
        const now = new Date();
        const threeDaysFromNow = new Date(new Date().setDate(now.getDate() + 3));
        const sevenDaysAgo = new Date(new Date().setDate(now.getDate() - 7));
        
        const remindersToSend = await pool.query(`
            SELECT 
                i.id, i.invoice_number, i.due_date, i.total_amount,
                c.name as client_name, c.email as client_email,
                u.name as user_name, u.company as user_company
            FROM invoices i
            JOIN clients c ON i.client_id = c.id
            JOIN users u ON i.user_id = u.id
            WHERE 
                i.status = 'sent'
                AND (
                    (i.due_date::date = $1::date) OR -- Due in 3 days
                    (i.due_date::date = $2::date)    -- Overdue by 7 days
                )
                AND (i.last_reminder_sent_at IS NULL OR i.last_reminder_sent_at < NOW() - INTERVAL '24 hours')
        `, [threeDaysFromNow, sevenDaysAgo]);

        if (remindersToSend.rows.length === 0) {
            return res.status(200).json({ message: 'No reminders to send.' });
        }

        for (const invoice of remindersToSend.rows) {
            const isOverdue = new Date(invoice.due_date) < now;
            const subject = isOverdue 
                ? `Reminder: Invoice ${invoice.invoice_number} is Overdue`
                : `Reminder: Invoice ${invoice.invoice_number} is Due Soon`;
            
            const body = isOverdue
                ? `<p>Hello ${invoice.client_name},</p><p>This is a friendly reminder that invoice ${invoice.invoice_number} for the amount of $${invoice.total_amount} is now overdue. Please submit your payment as soon as possible.</p><p>Thank you,<br/>${invoice.user_company || invoice.user_name}</p>`
                : `<p>Hello ${invoice.client_name},</p><p>This is a friendly reminder that invoice ${invoice.invoice_number} for the amount of $${invoice.total_amount} is due on ${new Date(invoice.due_date).toLocaleDateString()}.</p><p>Thank you,<br/>${invoice.user_company || invoice.user_name}</p>`;

            const msg = {
                to: invoice.client_email,
                from: 'dami@cytrustadvisory.ca', // Must be a verified sender
                subject: subject,
                html: body
            };
            
            await sgMail.send(msg);
            await pool.query('UPDATE invoices SET last_reminder_sent_at = NOW() WHERE id = $1', [invoice.id]);
        }
        
        res.status(200).json({ message: `Successfully sent ${remindersToSend.rows.length} reminders.` });
    } catch (err) {
        console.error('Error sending invoice reminders:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// =========================================================================
// AUTOMATION ENGINE API ROUTES
// =========================================================================

// GET all automations for the logged-in user
app.get('/api/automations', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        // This query fetches each automation and aggregates its associated actions into a JSON array
        const query = `
            SELECT 
                a.id, a.name, a.trigger_type, a.is_active,
                COALESCE(
                    (SELECT json_agg(act.*) FROM automation_actions act WHERE act.automation_id = a.id),
                    '[]'::json
                ) as actions
            FROM automations a
            WHERE a.user_id = $1
            ORDER BY a.created_at DESC;
        `;
        const automations = await pool.query(query, [userId]);
        res.status(200).json(automations.rows);
    } catch (err) {
        console.error('Error fetching automations:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new automation with its actions
app.post('/api/automations', authenticateToken, checkSubscription(['solo', 'team']), async (req, res) => {
    const { name, trigger_type, actions } = req.body;
    const { userId } = req.user;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Insert the main automation rule
        const automationQuery = 'INSERT INTO automations (user_id, name, trigger_type) VALUES ($1, $2, $3) RETURNING id';
        const automationRes = await client.query(automationQuery, [userId, name, trigger_type]);
        const automationId = automationRes.rows[0].id;

        // Insert each associated action
        for (const action of actions) {
            const actionQuery = 'INSERT INTO automation_actions (automation_id, action_type, params) VALUES ($1, $2, $3)';
            await client.query(actionQuery, [automationId, action.action_type, action.params]);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Automation created successfully', automationId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating automation:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

// PUT (update) an automation's basic details (e.g., name or active status)
app.put('/api/automations/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, is_active } = req.body;
    const { userId } = req.user;
    try {
        const result = await pool.query(
            'UPDATE automations SET name = $1, is_active = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [name, is_active, id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Automation not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating automation:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE an automation and its actions (cascade delete)
app.delete('/api/automations/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const result = await pool.query('DELETE FROM automations WHERE id = $1 AND user_id = $2', [id, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Automation not found.' });
        }
        res.status(200).json({ message: 'Automation deleted successfully.' });
    } catch (err) {
        console.error('Error deleting automation:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: Endpoint to get actionable alerts, like overdue invoices
app.get('/api/alerts/overdue-invoices', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        // Find invoices that are exactly 3 days overdue and for which a reminder hasn't been sent in the last day
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const query = `
            SELECT i.id, i.invoice_number, i.total_amount, c.name as client_name
            FROM invoices i
            JOIN clients c ON i.client_id = c.id
            WHERE i.user_id = $1
              AND i.status = 'sent'
              AND i.due_date::date = $2::date
              AND (i.last_reminder_sent_at IS NULL OR i.last_reminder_sent_at < NOW() - INTERVAL '1 day')
        `;
        const overdueInvoices = await pool.query(query, [userId, threeDaysAgo]);
        
        res.status(200).json(overdueInvoices.rows);
    } catch (err) {
        console.error('Error fetching overdue invoices:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// =========================================================================
// CREATE CHECKOUT SESSION FOR SUBSCRIPTIONS
// =========================================================================
app.post('/api/subscriptions/create-checkout-session', authenticateToken, async (req, res) => {
  const { planName } = req.body;
  const { email } = req.user;

  // Map plan names to Stripe Price IDs
  const priceMap = {
    Solo: process.env.STRIPE_SOLO_PLAN_PRICE_ID,
    Team: process.env.STRIPE_TEAM_PLAN_PRICE_ID,
  };

  const priceId = priceMap[planName];
  if (!priceId) {
    return res.status(400).json({ message: `Invalid plan name: ${planName}` });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      subscription_data: {
        trial_period_days: 14, // optional
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error creating Stripe subscription session:', err);
    return res.status(500).json({ message: 'Server error while creating payment session.' });
  }
});



// =========================================================================
// SERVER START
// =========================================================================
const startServer = async () => {
    try {
        await pool.connect();
        console.log('Database connected successfully.');
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server is listening on http://localhost:${PORT} and is ready for requests.`);
        });
    } catch (err) {
        console.error('Failed to start server due to database error:', err);
        process.exit(1);
    }
};

startServer();
