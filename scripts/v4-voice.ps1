param([string]$OutputDirectory='output/caleira-v4-pilot/audio')
$ErrorActionPreference='Stop'
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null=[Windows.Media.SpeechSynthesis.SpeechSynthesizer,Windows.Media.SpeechSynthesis,ContentType=WindowsRuntime]
$null=[Windows.Storage.Streams.DataReader,Windows.Storage.Streams,ContentType=WindowsRuntime]
$synth=New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$voices=[Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
$voices | Select-Object DisplayName,Language,Id | ConvertTo-Json | Set-Content (Join-Path $OutputDirectory 'voices.json')
$voice=$voices | Where-Object { $_.DisplayName -match 'Katja' } | Select-Object -First 1
if(-not $voice){$voice=$voices | Where-Object {$_.Language -eq 'de-DE'} | Select-Object -First 1}
if(-not $voice){throw 'No installed German voice'}
$synth.Voice=$voice
$synth.Options.SpeakingRate=1.03
$asTask=([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'})[0]
function Await-Result($operation,$resultType){$task=$asTask.MakeGenericMethod($resultType).Invoke($null,@($operation));$task.Wait();return $task.Result}
$lines=@(
 'Marco entdeckt Caleira im Showroom.',
 'Aus Interesse wird eine Anfrage.',
 'PartnerConnect ordnet sie einer verantwortlichen Person zu.',
 'So wird aus der Anfrage ein nächster Schritt.'
)
for($i=0;$i -lt $lines.Count;$i++){
 $stream=Await-Result ($synth.SynthesizeTextToStreamAsync($lines[$i])) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
 $reader=New-Object Windows.Storage.Streams.DataReader($stream)
 $null=Await-Result ($reader.LoadAsync([uint32]$stream.Size)) ([uint32])
 $bytes=New-Object byte[] $stream.Size
 $reader.ReadBytes($bytes)
 [IO.File]::WriteAllBytes((Join-Path (Resolve-Path $OutputDirectory) ('voice-'+($i+1)+'.wav')),$bytes)
 $reader.Dispose();$stream.Dispose()
}
$voice | Select-Object DisplayName,Language,Id | ConvertTo-Json | Set-Content (Join-Path $OutputDirectory 'selected-voice.json')
$synth.Dispose()
