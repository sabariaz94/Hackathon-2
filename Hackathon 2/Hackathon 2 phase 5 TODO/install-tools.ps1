# Install kubectl-ai
$tempDir = Join-Path $env:TEMP "kubectl-ai"
$gopath = go env GOPATH

if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}

Write-Host "Cloning kubectl-ai..."
git clone https://github.com/sozercan/kubectl-ai.git $tempDir

Write-Host "Building kubectl-ai..."
Push-Location $tempDir
go build -o "$gopath\bin\kubectl-ai.exe" .
Pop-Location

Write-Host "Verifying kubectl-ai..."
& "$gopath\bin\kubectl-ai.exe" --help 2>&1 | Select-Object -First 3

# Install kagent
Write-Host ""
Write-Host "Installing kagent..."
pip install kagent-cli 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "kagent-cli not found, trying kagent..."
    pip install kagent 2>&1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "kagent pip package not available. Trying from GitHub..."
    pip install git+https://github.com/kagent-dev/kagent.git 2>&1
}

Write-Host ""
Write-Host "Done. Restart your terminal to use the tools."
