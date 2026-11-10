# init.ps1 - verification entrypoint for the Cargolane prototype.
# Fails fast: the Node check exits non-zero when content, pricing or wiring break.

$ErrorActionPreference = 'Stop'

Write-Host '=== Cargolane verification ==='
Write-Host 'Running: node check.mjs'

node check.mjs
if ($LASTEXITCODE -ne 0) {
    throw "check.mjs failed with exit code $LASTEXITCODE"
}

Write-Host ''
Write-Host '=== Verification complete ==='
