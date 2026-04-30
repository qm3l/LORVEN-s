// Vercel Serverless Function - جلب الإعدادات من GitHub
export default async function handler(req, res) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/qm3l/LORVEN-s/main/js/core/state.js');
        const text = await response.text();
        
        res.setHeader('Content-Type', 'application/javascript');
        return res.status(200).send(text);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
