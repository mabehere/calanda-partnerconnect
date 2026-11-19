"""Original procedural score and foley; no samples or external audio assets."""
import wave, json
from pathlib import Path
import numpy as np

OUT=Path('output/caleira-v4-pilot/audio'); OUT.mkdir(parents=True,exist_ok=True)
SR=48000; duration=14.9; t=np.arange(round(SR*duration))/SR
music=np.zeros_like(t); fx=np.zeros_like(t)
def fade(time,length):
    return np.clip(time/.15,0,1)*np.clip((length-time)/.45,0,1)
for start,notes,length in [(0,[196,246.94,293.66],6),(6,[174.61,220,261.63],4.8),(10.8,[196,246.94,293.66],4.1)]:
    x=t-start; env=fade(x,length)*(x>=0)*(x<length)
    for hz in notes: music+=.006*env*(np.sin(2*np.pi*hz*x)+.14*np.sin(4*np.pi*hz*x))
for start,notes in [(3.17,[587.33,783.99]),(6.25,[392,523.25]),(10.73,[659.25,783.99])]:
    for j,hz in enumerate(notes):
        x=t-start-j*.11; env=np.clip(x/.008,0,1)*np.exp(-np.maximum(x,0)*9)*(x>=0)*(x<.8)
        fx+=.038*env*np.sin(2*np.pi*hz*x)
def save(name,data):
    with wave.open(str(OUT/name),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
save('music.wav',music);save('sound-design.wav',fx)
mix=music+fx; report={'sampleRate':SR,'duration':duration,'voices':[]}
for i,start in enumerate([.2,3.2,6.2,10.8]):
    with wave.open(str(OUT/f'voice-{i+1}.wav'),'rb') as w:
        rate=w.getframerate(); channels=w.getnchannels(); data=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,channels).mean(axis=1)/32768
    resampled=np.interp(np.arange(round(len(data)/rate*SR))/SR,np.arange(len(data))/rate,data)
    pos=round(start*SR); usable=min(len(resampled),len(mix)-pos);mix[pos:pos+usable]+=.92*resampled[:usable]
    report['voices'].append({'file':f'voice-{i+1}.wav','start':start,'seconds':len(data)/rate,'peak':float(np.max(np.abs(data)))})
report['mixPeak']=float(np.max(np.abs(mix)));report['mixPeakDbFS']=float(20*np.log10(report['mixPeak']));report['clippedSamples']=int(np.sum(np.abs(mix)>=1))
save('pilot-listening-mix.wav',mix)
(OUT/'audio-check.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
