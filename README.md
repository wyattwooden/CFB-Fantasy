# CFB Fantasy Logo Upload Guide

## Prerequisites
1. AWS CLI installed and configured
2. AWS credentials set up (`aws configure`)
3. Access to the `cfb-fantasy-logos` S3 bucket

## Steps to Upload New Logos

### 1. Prepare the Logo
- Save the logo as a PNG file
- Use lowercase letters and underscores for the filename (e.g., `ohio_state.png`)
- Place the logo in the `images/cfb logos` directory

### 2. Update the JSON File
- Open `js/college-logos.json`
- Add a new entry for the college:
```json
"College Name": "https://d3q0o4xpk78x59.cloudfront.net/cfb/college_name.png"
```
- Maintain alphabetical order

### 3. Upload to S3
- Open PowerShell
- Navigate to the project directory:
```powershell
cd Documents/CFB_Fantasy
```
- Run the upload script:
```powershell
.\upload-logos.ps1
```

### 4. Verify Upload
1. Check AWS Console:
   - Go to https://console.aws.com
   - Search for "S3"
   - Click on `cfb-fantasy-logos` bucket
   - Navigate to the `cfb` folder
   - Verify the new logo is present

2. Test CloudFront URL:
   - Open: https://d3q0o4xpk78x59.cloudfront.net/cfb/college_name.png
   - Verify the logo loads correctly

### 5. Test in Application
- Refresh your application
- Create a test post with the college name
- Verify the logo appears in the news card

## Troubleshooting
- If upload fails, verify AWS credentials are correct
- If logo doesn't appear, check the CloudFront URL
- If S3 access is denied, verify bucket policy is correct

## Important Notes
- Keep logo files under 1MB
- Use transparent PNG backgrounds
- Maintain consistent naming convention
- Always test the CloudFront URL after upload 