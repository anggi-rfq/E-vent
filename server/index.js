import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pool from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
    const bodyLog = { ...req.body };
    if (bodyLog.password) bodyLog.password = '[HIDDEN]';
    console.log(`[API] ${req.method} ${req.url} | Body:`, JSON.stringify(bodyLog));
    next();
});

// Helper for mapping rows to camelCase for frontend
const toCamelCase = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const mapKeys = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const mapped = {};
    for (const key in obj) {
        mapped[toCamelCase(key)] = obj[key];
    }
    return mapped;
};

// =============================
// TEST SERVER & DB
// =============================
app.get('/', (req, res) => res.json({ message: 'E-vent API is running' }));
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS result');
        res.json({ success: true, message: 'Database connected successfully', data: rows });
    } catch (error) {
        console.error('[DB ERROR] Test DB failed:', error);
        res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
    }
});

// =============================
// AUTH
// =============================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        delete user.password_hash;
        res.json({ success: true, message: 'Login successful', data: mapKeys(user) });
    } catch (error) {
        console.error('[API ERROR] /api/auth/login:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

// =============================
// USERS
// =============================
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        rows.forEach(r => delete r.password_hash);
        res.json({ success: true, data: rows.map(mapKeys) });
    } catch (error) {
        console.error('[API ERROR] GET /api/users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password, role, phone, department, avatar } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        // Check duplicate email
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
        }

        const hash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('password123', 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role, phone, department, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hash, role || 'MEMBER', phone || null, department || null, avatar || null]
        );
        res.status(201).json({
            success: true,
            data: { id: result.insertId, name, email, role: role || 'MEMBER', phone, department, avatar }
        });
    } catch (error) {
        console.error('[API ERROR] POST /api/users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, phone, department, avatar } = req.body;

        const updateFields = [];
        const values = [];
        if (name !== undefined) { updateFields.push('name=?'); values.push(name); }
        if (email !== undefined) { updateFields.push('email=?'); values.push(email); }
        if (role !== undefined) { updateFields.push('role=?'); values.push(role); }
        if (phone !== undefined) { updateFields.push('phone=?'); values.push(phone); }
        if (department !== undefined) { updateFields.push('department=?'); values.push(department); }
        if (avatar !== undefined) { updateFields.push('avatar=?'); values.push(avatar); }

        if (updateFields.length > 0) {
            values.push(id);
            await pool.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id=?`, values);
        }

        res.json({ success: true, data: { id, ...req.body } });
    } catch (error) {
        console.error('[API ERROR] PUT /api/users/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('[API ERROR] DELETE /api/users/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================
// EVENTS
// =============================
app.get('/api/events', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
        res.json({ success: true, data: rows.map(mapKeys) });
    } catch (error) {
        console.error('[API ERROR] GET /api/events:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        const {
            name,
            description,
            start_date, startDate,
            end_date, endDate,
            location,
            status,
            manager_id, managerId,
            banner_color, bannerColor,
            icon,
            target_attendees, targetAttendees,
            budget_total, budgetTotal,
            budget_spent, budgetSpent
        } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Nama event wajib diisi' });
        }

        const sDate = startDate || start_date || new Date().toISOString().split('T')[0];
        const eDate = endDate || end_date || sDate;
        let mId = managerId || manager_id;

        // If manager ID not provided, find first available user
        if (!mId) {
            const [users] = await pool.query('SELECT id FROM users LIMIT 1');
            mId = users.length > 0 ? users[0].id : 1;
        }

        const [result] = await pool.query(
            `INSERT INTO events (name, description, start_date, end_date, location, status, manager_id, banner_color, icon, target_attendees, budget_total, budget_spent) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                description || '',
                sDate,
                eDate,
                location || '',
                status || 'PLANNING',
                mId,
                bannerColor || banner_color || 'from-indigo-500 to-purple-600',
                icon || '🎯',
                targetAttendees || target_attendees || 0,
                budgetTotal || budget_total || 0,
                budgetSpent || budget_spent || 0
            ]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                name,
                description,
                startDate: sDate,
                endDate: eDate,
                location,
                status: status || 'PLANNING',
                managerId: mId,
                bannerColor: bannerColor || banner_color,
                icon,
                targetAttendees: targetAttendees || target_attendees || 0,
                budgetTotal: budgetTotal || budget_total || 0,
                budgetSpent: budgetSpent || budget_spent || 0
            }
        });
    } catch (error) {
        console.error('[API ERROR] POST /api/events:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            start_date, startDate,
            end_date, endDate,
            location,
            status,
            manager_id, managerId,
            banner_color, bannerColor,
            icon,
            target_attendees, targetAttendees,
            budget_total, budgetTotal,
            budget_spent, budgetSpent
        } = req.body;

        const updateFields = [];
        const values = [];

        if (name !== undefined) { updateFields.push('name=?'); values.push(name); }
        if (description !== undefined) { updateFields.push('description=?'); values.push(description); }
        if (startDate !== undefined || start_date !== undefined) { updateFields.push('start_date=?'); values.push(startDate || start_date); }
        if (endDate !== undefined || end_date !== undefined) { updateFields.push('end_date=?'); values.push(endDate || end_date); }
        if (location !== undefined) { updateFields.push('location=?'); values.push(location); }
        if (status !== undefined) { updateFields.push('status=?'); values.push(status); }
        if (managerId !== undefined || manager_id !== undefined) { updateFields.push('manager_id=?'); values.push(managerId || manager_id); }
        if (bannerColor !== undefined || banner_color !== undefined) { updateFields.push('banner_color=?'); values.push(bannerColor || banner_color); }
        if (icon !== undefined) { updateFields.push('icon=?'); values.push(icon); }
        if (targetAttendees !== undefined || target_attendees !== undefined) { updateFields.push('target_attendees=?'); values.push(targetAttendees || target_attendees); }
        if (budgetTotal !== undefined || budget_total !== undefined) { updateFields.push('budget_total=?'); values.push(budgetTotal || budget_total); }
        if (budgetSpent !== undefined || budget_spent !== undefined) { updateFields.push('budget_spent=?'); values.push(budgetSpent || budget_spent); }

        if (updateFields.length > 0) {
            values.push(id);
            await pool.query(`UPDATE events SET ${updateFields.join(', ')} WHERE id=?`, values);
        }

        res.json({ success: true, data: { id, ...req.body } });
    } catch (error) {
        console.error('[API ERROR] PUT /api/events/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM events WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('[API ERROR] DELETE /api/events/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================
// DIVISIONS
// =============================
app.get('/api/divisions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM divisions');
        res.json({ success: true, data: rows.map(mapKeys) });
    } catch (error) {
        console.error('[API ERROR] GET /api/divisions:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/divisions', async (req, res) => {
    try {
        const { event_id, eventId, name, description, coordinator_id, coordinatorId, color, icon } = req.body;
        const eId = event_id || eventId;
        const cId = coordinator_id || coordinatorId || null;

        if (!eId) {
            return res.status(400).json({ success: false, message: 'Event ID wajib diisi' });
        }
        if (!name) {
            return res.status(400).json({ success: false, message: 'Nama divisi wajib diisi' });
        }

        // Validate event exists
        const [events] = await pool.query('SELECT id FROM events WHERE id = ?', [eId]);
        if (events.length === 0) {
            return res.status(400).json({ success: false, message: 'Event tidak ditemukan di database' });
        }

        const [result] = await pool.query(
            'INSERT INTO divisions (event_id, name, description, coordinator_id, color, icon) VALUES (?, ?, ?, ?, ?, ?)',
            [eId, name, description || '', cId, color || '#6366f1', icon || '💼']
        );
        res.status(201).json({
            success: true,
            data: { id: result.insertId, eventId: eId, name, description, coordinatorId: cId, color, icon }
        });
    } catch (error) {
        console.error('[API ERROR] POST /api/divisions:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/divisions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, coordinator_id, coordinatorId, color, icon } = req.body;

        const updateFields = [];
        const values = [];

        if (name !== undefined) { updateFields.push('name=?'); values.push(name); }
        if (description !== undefined) { updateFields.push('description=?'); values.push(description); }
        if (coordinatorId !== undefined || coordinator_id !== undefined) {
            updateFields.push('coordinator_id=?');
            values.push(coordinatorId || coordinator_id || null);
        }
        if (color !== undefined) { updateFields.push('color=?'); values.push(color); }
        if (icon !== undefined) { updateFields.push('icon=?'); values.push(icon); }

        if (updateFields.length > 0) {
            values.push(id);
            await pool.query(`UPDATE divisions SET ${updateFields.join(', ')} WHERE id=?`, values);
        }

        res.json({ success: true, data: { id, ...req.body } });
    } catch (error) {
        console.error('[API ERROR] PUT /api/divisions/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/divisions/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM divisions WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('[API ERROR] DELETE /api/divisions/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================
// TASKS
// =============================
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        const mapped = rows.map(r => {
            const m = mapKeys(r);
            m.deadline = m.dueDate || m.deadline || '';
            return m;
        });
        res.json({ success: true, data: mapped });
    } catch (error) {
        console.error('[API ERROR] GET /api/tasks:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const {
            event_id, eventId,
            division_id, divisionId,
            assigned_to, assignedTo,
            created_by, createdBy,
            title,
            description,
            status,
            priority,
            due_date, dueDate, deadline,
            progress
        } = req.body;

        const eId = eventId || event_id;
        if (!eId) {
            return res.status(400).json({ success: false, message: 'Event ID wajib diisi' });
        }
        if (!title) {
            return res.status(400).json({ success: false, message: 'Judul tugas wajib diisi' });
        }

        let cBy = createdBy || created_by;
        if (!cBy) {
            const [users] = await pool.query('SELECT id FROM users LIMIT 1');
            cBy = users.length > 0 ? users[0].id : 1;
        }

        const finalDueDate = deadline || dueDate || due_date || null;

        const [result] = await pool.query(
            `INSERT INTO tasks (event_id, division_id, assigned_to, created_by, title, description, status, priority, due_date, progress) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                eId,
                divisionId || division_id || null,
                assignedTo || assigned_to || null,
                cBy,
                title,
                description || '',
                status || 'TODO',
                priority || 'MEDIUM',
                finalDueDate,
                progress || 0
            ]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                eventId: eId,
                divisionId: divisionId || division_id || null,
                assignedTo: assignedTo || assigned_to || null,
                createdBy: cBy,
                title,
                description,
                status: status || 'TODO',
                priority: priority || 'MEDIUM',
                deadline: finalDueDate,
                dueDate: finalDueDate,
                progress: progress || 0
            }
        });
    } catch (error) {
        console.error('[API ERROR] POST /api/tasks:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            status,
            priority,
            due_date, dueDate, deadline,
            progress,
            assigned_to, assignedTo,
            division_id, divisionId
        } = req.body;

        const updateFields = [];
        const values = [];

        if (title !== undefined) { updateFields.push('title=?'); values.push(title); }
        if (description !== undefined) { updateFields.push('description=?'); values.push(description); }
        if (status !== undefined) { updateFields.push('status=?'); values.push(status); }
        if (priority !== undefined) { updateFields.push('priority=?'); values.push(priority); }
        if (deadline !== undefined || dueDate !== undefined || due_date !== undefined) {
            updateFields.push('due_date=?');
            values.push(deadline || dueDate || due_date);
        }
        if (progress !== undefined) { updateFields.push('progress=?'); values.push(progress); }
        if (assignedTo !== undefined || assigned_to !== undefined) {
            updateFields.push('assigned_to=?');
            values.push(assignedTo || assigned_to || null);
        }
        if (divisionId !== undefined || division_id !== undefined) {
            updateFields.push('division_id=?');
            values.push(divisionId || division_id || null);
        }

        if (updateFields.length > 0) {
            values.push(id);
            await pool.query(`UPDATE tasks SET ${updateFields.join(', ')} WHERE id=?`, values);
        }

        res.json({ success: true, data: { id, ...req.body } });
    } catch (error) {
        console.error('[API ERROR] PUT /api/tasks/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('[API ERROR] DELETE /api/tasks/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================
// MEMBERS (EVENT_MEMBERS)
// =============================
app.get('/api/members', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM event_members');
        res.json({ success: true, data: rows.map(mapKeys) });
    } catch (error) {
        console.error('[API ERROR] GET /api/members:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/members', async (req, res) => {
    try {
        const { event_id, eventId, user_id, userId, division_id, divisionId, position } = req.body;
        const eId = eventId || event_id;
        const uId = userId || user_id;

        if (!eId || !uId) {
            return res.status(400).json({ success: false, message: 'Event ID dan User ID wajib diisi' });
        }

        const [result] = await pool.query(
            'INSERT INTO event_members (event_id, user_id, division_id, position) VALUES (?, ?, ?, ?)',
            [eId, uId, divisionId || division_id || null, position || 'Anggota']
        );
        res.status(201).json({
            success: true,
            data: { id: result.insertId, eventId: eId, userId: uId, divisionId: divisionId || division_id || null, position }
        });
    } catch (error) {
        console.error('[API ERROR] POST /api/members:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/members/:id', async (req, res) => {
    try {
        const { division_id, divisionId, position } = req.body;
        await pool.query(
            'UPDATE event_members SET division_id=?, position=? WHERE id=?',
            [divisionId || division_id || null, position, req.params.id]
        );
        res.json({ success: true, data: { id: req.params.id, ...req.body } });
    } catch (error) {
        console.error('[API ERROR] PUT /api/members/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/members/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM event_members WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('[API ERROR] DELETE /api/members/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================
// TASK UPDATES
// =============================
app.get('/api/task-updates', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM task_updates ORDER BY created_at DESC');
        const mapped = rows.map(r => {
            const m = mapKeys(r);
            m.description = m.comment || m.description || '';
            return m;
        });
        res.json({ success: true, data: mapped });
    } catch (error) {
        console.error('[API ERROR] GET /api/task-updates:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/task-updates', async (req, res) => {
    try {
        const { taskId, task_id, userId, user_id, progress, description, comment } = req.body;
        const tId = taskId || task_id;
        let uId = userId || user_id;

        if (!tId) {
            return res.status(400).json({ success: false, message: 'Task ID wajib diisi' });
        }

        if (!uId) {
            const [users] = await pool.query('SELECT id FROM users LIMIT 1');
            uId = users.length > 0 ? users[0].id : 1;
        }

        const [result] = await pool.query(
            'INSERT INTO task_updates (task_id, user_id, progress, comment) VALUES (?, ?, ?, ?)',
            [tId, uId, progress || 0, description || comment || '']
        );
        res.status(201).json({
            success: true,
            data: { id: result.insertId, taskId: tId, userId: uId, progress, description: description || comment }
        });
    } catch (error) {
        console.error('[API ERROR] POST /api/task-updates:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================
// ATTACHMENTS
// =============================
app.get('/api/attachments', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM attachments ORDER BY created_at DESC');
        const mapped = rows.map(r => {
            const m = mapKeys(r);
            m.userId = m.uploadedBy || m.userId;
            m.fileUrl = m.filePath || m.fileUrl || '';
            return m;
        });
        res.json({ success: true, data: mapped });
    } catch (error) {
        console.error('[API ERROR] GET /api/attachments:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/attachments', async (req, res) => {
    try {
        const {
            taskId, task_id,
            uploadedBy, uploaded_by, userId, user_id,
            fileName, file_name,
            fileUrl, filePath, file_path,
            fileType, file_type,
            fileSize, file_size
        } = req.body;

        const tId = taskId || task_id;
        let uBy = uploadedBy || uploaded_by || userId || user_id;
        const fName = fileName || file_name;

        if (!tId) {
            return res.status(400).json({ success: false, message: 'Task ID wajib diisi' });
        }
        if (!fName) {
            return res.status(400).json({ success: false, message: 'File name wajib diisi' });
        }

        if (!uBy) {
            const [users] = await pool.query('SELECT id FROM users LIMIT 1');
            uBy = users.length > 0 ? users[0].id : 1;
        }

        const fPath = fileUrl || filePath || file_path || '';

        const [result] = await pool.query(
            'INSERT INTO attachments (task_id, uploaded_by, file_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?)',
            [tId, uBy, fName, fPath, fileType || file_type || 'application/octet-stream', fileSize || file_size || 0]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                taskId: tId,
                userId: uBy,
                uploadedBy: uBy,
                fileName: fName,
                fileUrl: fPath,
                fileType: fileType || file_type,
                fileSize: fileSize || file_size || 0
            }
        });
    } catch (error) {
        console.error('[API ERROR] POST /api/attachments:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/attachments/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM attachments WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('[API ERROR] DELETE /api/attachments/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================
// MILESTONES
// =============================
app.get('/api/milestones', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM event_milestones ORDER BY milestone_date ASC');
        const mapped = rows.map(r => {
            const m = mapKeys(r);
            m.isCompleted = m.status === 'COMPLETED';
            m.targetDate = m.milestoneDate || m.targetDate || '';
            m.date = m.milestoneDate || m.date || '';
            return m;
        });
        res.json({ success: true, data: mapped });
    } catch (error) {
        console.error('[API ERROR] GET /api/milestones:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/milestones', async (req, res) => {
    try {
        const {
            eventId, event_id,
            title,
            description,
            date, targetDate, milestoneDate, milestone_date,
            isCompleted, status
        } = req.body;

        const eId = eventId || event_id;
        if (!eId) {
            return res.status(400).json({ success: false, message: 'Event ID wajib diisi' });
        }
        if (!title) {
            return res.status(400).json({ success: false, message: 'Judul milestone wajib diisi' });
        }

        const mDate = targetDate || date || milestoneDate || milestone_date || new Date().toISOString().split('T')[0];
        const mStatus = status || (isCompleted ? 'COMPLETED' : 'UPCOMING');

        const [result] = await pool.query(
            'INSERT INTO event_milestones (event_id, title, description, milestone_date, status) VALUES (?, ?, ?, ?, ?)',
            [eId, title, description || '', mDate, mStatus]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                eventId: eId,
                title,
                description,
                targetDate: mDate,
                date: mDate,
                isCompleted: mStatus === 'COMPLETED',
                status: mStatus
            }
        });
    } catch (error) {
        console.error('[API ERROR] POST /api/milestones:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/milestones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompleted, status, title, description, targetDate, date } = req.body;

        const updateFields = [];
        const values = [];

        if (status !== undefined) {
            updateFields.push('status=?');
            values.push(status);
        } else if (isCompleted !== undefined) {
            updateFields.push('status=?');
            values.push(isCompleted ? 'COMPLETED' : 'UPCOMING');
        }

        if (title !== undefined) { updateFields.push('title=?'); values.push(title); }
        if (description !== undefined) { updateFields.push('description=?'); values.push(description); }
        if (targetDate !== undefined || date !== undefined) {
            updateFields.push('milestone_date=?');
            values.push(targetDate || date);
        }

        if (updateFields.length > 0) {
            values.push(id);
            await pool.query(`UPDATE event_milestones SET ${updateFields.join(', ')} WHERE id=?`, values);
        }

        res.json({ success: true, data: { id, ...req.body } });
    } catch (error) {
        console.error('[API ERROR] PUT /api/milestones/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/milestones/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM event_milestones WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('[API ERROR] DELETE /api/milestones/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================
// ACTIVITY LOGS
// =============================
app.get('/api/activity-logs', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100');
        const mapped = rows.map(r => {
            const m = mapKeys(r);
            m.timestamp = m.createdAt || new Date().toISOString();
            return m;
        });
        res.json({ success: true, data: mapped });
    } catch (error) {
        console.error('[API ERROR] GET /api/activity-logs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/activity-logs', async (req, res) => {
    try {
        const { userId, user_id, eventId, event_id, action, description } = req.body;
        const [result] = await pool.query(
            'INSERT INTO activity_logs (user_id, event_id, action, description) VALUES (?, ?, ?, ?)',
            [userId || user_id || null, eventId || event_id || null, action || 'Aktivitas', description || '']
        );
        res.status(201).json({ success: true, data: { id: result.insertId, ...req.body } });
    } catch (error) {
        console.error('[API ERROR] POST /api/activity-logs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});