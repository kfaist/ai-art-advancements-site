/**
 * Zapier Webhook Server for Instagram Generator
 * This receives triggers from Zapier and generates content
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3456;

// Webhook endpoint for Zapier
app.post('/webhook/generate-instagram', async (req, res) => {
  console.log('📨 Webhook received from Zapier!');
  
  const { 
    theme = 'aiArt',
    count = 1,
    trigger = 'manual'
  } = req.body;
  
  console.log(`Generating ${count} ${theme} carousel(s)...`);
  
  // Run the generator
  exec('node generate-carousel.js', { 
    cwd: __dirname 
  }, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    // Find the latest draft
    const draftsDir = path.join(__dirname, 'drafts');
    const folders = fs.readdirSync(draftsDir)
      .filter(f => fs.statSync(path.join(draftsDir, f)).isDirectory())
      .sort((a, b) => b.localeCompare(a));
    
    if (folders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No drafts created' 
      });
    }
    
    const latestDraft = folders[0];
    const draftPath = path.join(draftsDir, latestDraft);
    
    // Read the generated content
    const metadata = JSON.parse(
      fs.readFileSync(path.join(draftPath, 'metadata.json'), 'utf8')
    );
    
    const caption = fs.readFileSync(
      path.join(draftPath, 'caption.txt'), 'utf8'
    );
    
    // Prepare response for Zapier
    const response = {
      success: true,
      generated: latestDraft,
      caption: caption,
      theme: metadata.theme,
      files: metadata.files,
      timestamp: new Date().toISOString(),
      // Include file URLs if needed
      draftsPath: draftPath
    };
    
    console.log('✅ Content generated successfully!');
    res.json(response);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Instagram Generator Webhook',
    timestamp: new Date().toISOString()
  });
});

// Get latest draft info
app.get('/latest-draft', (req, res) => {
  const draftsDir = path.join(__dirname, 'drafts');
  
  if (!fs.existsSync(draftsDir)) {
    return res.status(404).json({ 
      error: 'No drafts folder' 
    });
  }
  
  const folders = fs.readdirSync(draftsDir)
    .filter(f => fs.statSync(path.join(draftsDir, f)).isDirectory())
    .sort((a, b) => b.localeCompare(a));
  
  if (folders.length === 0) {
    return res.status(404).json({ 
      error: 'No drafts found' 
    });
  }
  
  const latestDraft = folders[0];
  const draftPath = path.join(draftsDir, latestDraft);
  
  const metadata = JSON.parse(
    fs.readFileSync(path.join(draftPath, 'metadata.json'), 'utf8')
  );
  
  res.json({
    draft: latestDraft,
    ...metadata
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ===============================================
  🚀 Zapier Webhook Server Running!
  ===============================================
  
  Webhook URL: http://localhost:${PORT}/webhook/generate-instagram
  Health Check: http://localhost:${PORT}/health
  Latest Draft: http://localhost:${PORT}/latest-draft
  
  Use ngrok for external access:
  ngrok http ${PORT}
  
  ===============================================
  `);
});