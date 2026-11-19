param([string]$Python='python',[switch]$RegenerateVoice)
$ErrorActionPreference='Stop'
$v4Output='output/caleira-v4-pilot'
New-Item -ItemType Directory -Force -Path "$v4Output/audio",'tmp/v4-public/audio','tmp/v4-public/legacy','tmp/v4-public/assets/journey-v3' | Out-Null
if ($RegenerateVoice -or -not (Test-Path "$v4Output/audio/voice-4.wav")) {
    & powershell.exe -NoProfile -File scripts/v4-voice.ps1
    if ($LASTEXITCODE -ne 0) { throw 'German local voice generation failed' }
}
& $Python scripts/v4-audio.py
if ($LASTEXITCODE -ne 0) { throw 'Audio preparation failed' }
Copy-Item -Path "$v4Output/audio/voice-*.wav","$v4Output/audio/music.wav","$v4Output/audio/sound-design.wav" -Destination 'tmp/v4-public/audio'
Copy-Item -Path 'public/assets/journey-v3/*.glb' -Destination 'tmp/v4-public/legacy'
Copy-Item -Path 'public/assets/journey-v3/*' -Destination 'tmp/v4-public/assets/journey-v3'
Write-Output 'Isolated V4 public directory prepared. Production public/media is unchanged.'
