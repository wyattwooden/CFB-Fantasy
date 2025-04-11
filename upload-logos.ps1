# PowerShell script to upload logos to S3

# Set the bucket name
$bucketName = "cfb-fantasy-logos"

# Set the local directory containing the logos
$localDir = "images/cfb logos"

# Get all PNG files in the directory
$files = Get-ChildItem -Path $localDir -Filter "*.png"

# Upload each file to S3
foreach ($file in $files) {
    $s3Key = "cfb/$($file.Name)"
    Write-Host "Uploading $($file.Name) to s3://$bucketName/$s3Key"
    aws s3 cp $file.FullName "s3://$bucketName/$s3Key"
}

Write-Host "Upload complete!" 