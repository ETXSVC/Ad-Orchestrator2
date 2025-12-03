import { execute, queryOne } from '../db/database.js';
import { initDatabase } from '../db/database.js';

console.log('Creating test approval...');

// Ensure DB is initialized
initDatabase();

// 1. Create a test campaign if needed
let campaign = queryOne("SELECT * FROM campaigns WHERE id = 1");
if (!campaign) {
    execute(`
        INSERT INTO campaigns (title, description, status, start_date, end_date, budget, created_by)
        VALUES ('Test Campaign', 'A campaign for testing approvals', 'draft', '2025-01-01', '2025-01-31', 5000, 1)
    `);
    console.log('Created test campaign');
}

// 2. Create an approval request
const result = execute(`
    INSERT INTO approvals (campaign_id, workflow_type, status, current_step, total_steps, priority, submitted_by, created_at)
    VALUES (1, 'parallel', 'pending', 0, 1, 'high', 1, CURRENT_TIMESTAMP)
`);
const approvalId = result.lastInsertRowid;
console.log(`Created approval #${approvalId}`);

// 3. Create approval step for admin (user 1)
execute(`
    INSERT INTO approval_steps (approval_id, step_number, approver_id, status)
    VALUES (?, 0, 1, 'pending')
`, [approvalId]);

console.log('Created approval step for user 1');
console.log('Done!');
