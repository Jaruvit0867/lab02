import connectToDatabase from '../../../lib/mongodb';
import mongoose from 'mongoose';

// สร้าง schema ของ Task
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, default: 'not done' },
    dueDate: Date
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

// API route สำหรับการสร้างและอ่านงานทั้งหมด
export default async function handler(req, res) {
    const { method } = req;

    await connectToDatabase();

    switch (method) {
        case 'GET': // อ่านงานทั้งหมด
            try {
                const tasks = await Task.find({});
                res.status(200).json({ success: true, data: tasks });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST': // สร้างงานใหม่
            try {
                const task = await Task.create(req.body);
                res.status(201).json({ success: true, data: task });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}