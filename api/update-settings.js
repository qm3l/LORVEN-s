// Vercel Serverless Function - تحديث الإعدادات على GitHub
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { key, value } = req.body;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    
    if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GitHub token not configured' });
    
    try {
        // 1. نجيب محتوى الملف الحالي من GitHub
        const getFile = await fetch('https://api.github.com/repos/qm3l/LORVEN-s/contents/js/core/state.js', {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        const fileData = await getFile.json();
        const content = Buffer.from(fileData.content, 'base64').toString('utf8');
        
        // 2. نعدل على قيمة الإعداد
        const regex = new RegExp(`(${key}:\\s*)[^,}]+`);
        const newContent = content.replace(regex, `$1'${value}'`);
        
        // 3. نرفع التحديث لـ GitHub
        const updateFile = await fetch('https://api.github.com/repos/qm3l/LORVEN-s/contents/js/core/state.js', {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Update ${key}`,
                content: Buffer.from(newContent).toString('base64'),
                sha: fileData.sha
            })
        });
        
        const result = await updateFile.json();
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
