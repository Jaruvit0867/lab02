import connectToDatabase from '../../../lib/mongodb';
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, default: 'not done' },
    dueDate: Date
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default async function handler(req, res) {
    const { method, query: { id } } = req;

    await connectToDatabase();

    switch (method) {
        case 'PUT': // อัพเดทงาน
            try {
                const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
                res.status(200).json({ success: true, data: task });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE': // ลบงาน
            try {
                await Task.findByIdAndDelete(id);
                res.status(200).json({ success: true });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}