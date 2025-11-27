# Script para corregir el archivo SSH config corrupto

$sshConfigPath = "$env:USERPROFILE\.ssh\config"

if (Test-Path $sshConfigPath) {
    Write-Host "Corrigiendo archivo SSH config..."
    
    # Leer el archivo
    $content = Get-Content $sshConfigPath -Raw -Encoding UTF8
    
    # Remover BOM si existe
    if ($content.StartsWith([char]0xFEFF)) {
        $content = $content.Substring(1)
    }
    
    # Remover caracteres BOM invisibles
    $content = $content -replace '\xEF\xBB\xBF', ''
    
    # Guardar con encoding UTF8 sin BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($sshConfigPath, $content, $utf8NoBom)
    
    Write-Host "Archivo SSH config corregido"
} else {
    Write-Host "Archivo SSH config no encontrado"
}
