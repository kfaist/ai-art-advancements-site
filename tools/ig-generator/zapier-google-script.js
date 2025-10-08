/**
 * Google Apps Script for Zapier Integration
 * Deploy this as a Web App to create a webhook endpoint
 * 
 * SETUP:
 * 1. Go to script.google.com
 * 2. Create new project
 * 3. Paste this code
 * 4. Deploy > New Deployment > Web App
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 * 7. Copy the Web App URL for Zapier
 */

// This handles POST requests from Zapier
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Log the request
    console.log('Received from Zapier:', data);
    
    // Create a trigger file in Google Drive
    const folder = DriveApp.getFoldersByName('Instagram_Generation_Queue').hasNext() 
      ? DriveApp.getFoldersByName('Instagram_Generation_Queue').next()
      : DriveApp.createFolder('Instagram_Generation_Queue');
    
    // Create a JSON file with the request
    const timestamp = new Date().toISOString();
    const fileName = `generate_${timestamp}.json`;
    const fileContent = JSON.stringify({
      timestamp: timestamp,
      theme: data.theme || 'aiArt',
      count: data.count || 1,
      triggerType: data.triggerType || 'zapier',
      status: 'pending'
    }, null, 2);
    
    folder.createFile(fileName, fileContent, MimeType.JSON);
    
    // Send response back to Zapier
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Generation request queued',
        timestamp: timestamp,
        fileName: fileName,
        instructions: 'Run GENERATE_INSTAGRAM.bat on your computer to process'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// This handles GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'healthy',
      message: 'Instagram Generator Google Apps Script',
      instructions: 'Send POST request to trigger generation'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Function to check queue (run this manually or on schedule)
function checkGenerationQueue() {
  const folder = DriveApp.getFoldersByName('Instagram_Generation_Queue').hasNext() 
    ? DriveApp.getFoldersByName('Instagram_Generation_Queue').next()
    : null;
    
  if (!folder) {
    console.log('No queue folder found');
    return;
  }
  
  const files = folder.getFilesByType(MimeType.JSON);
  const pending = [];
  
  while (files.hasNext()) {
    const file = files.next();
    const content = JSON.parse(file.getBlob().getDataAsString());
    if (content.status === 'pending') {
      pending.push({
        fileName: file.getName(),
        ...content
      });
    }
  }
  
  console.log(`Found ${pending.length} pending generation requests`);
  return pending;
}

// Helper function to mark as processed
function markAsProcessed(fileName) {
  const folder = DriveApp.getFoldersByName('Instagram_Generation_Queue').next();
  const files = folder.getFilesByName(fileName);
  
  if (files.hasNext()) {
    const file = files.next();
    const content = JSON.parse(file.getBlob().getDataAsString());
    content.status = 'processed';
    content.processedAt = new Date().toISOString();
    file.setContent(JSON.stringify(content, null, 2));
  }
}