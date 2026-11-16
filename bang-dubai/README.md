# บางดูไบ (Bang-Dubai)

โมชันกราฟิกแนวตั้ง 9:16 เรื่องน้ำมันดิบพุ่งทะลักกลางแยกอโศก — โครงเป็นโปรเจกต์ HyperFrames เพื่อเรนเดอร์เป็นวิดีโอในภายหลัง

## ภาพนิ่งตัวอย่าง

อยู่ที่ `renders/stills/scene-0.png` … `scene-7.png` และสตอรี่บอร์ด `renders/storyboard-sheet.jpg`

| ฉาก | ช่วง | ไฟล์ |
|---|---|---|
| เช้าวันจันทร์ | 0–8 วิ | scene-0 |
| 1 ชั่วโมงแรก | 8–18 วิ | scene-1 |
| 3 ชั่วโมงต่อมา | 18–28 วิ | scene-2 |
| 12 ชั่วโมงต่อมา | 28–38 วิ | scene-3 |
| 3 วันต่อมา | 38–48 วิ | scene-4 |
| 1 เดือนต่อมา | 48–58 วิ | scene-5 |
| 1 ปีต่อมา | 58–68 วิ | scene-6 |
| บางดูไบ (ปิดเรื่อง) | 68–75 วิ | scene-7 |

## สร้างใหม่

```bash
cd bang-dubai
node scripts/build.mjs          # ประกอบ compositions + stills HTML
node scripts/render-stills.mjs  # ถ่ายภาพนิ่งด้วย Chrome headless
```

ตัวคนใช้ไลบรารี `../shared/flat-people/` (createPerson + presets) ฉากหลังแยกอโศกใช้ชุดเดียวกันแล้วเปลี่ยนโทนตามเวลาของเรื่อง

## วิดีโอเต็ม v1 (เสียงพากย์แบบ A)

ความยาว 98 วินาที 1080×1920 30fps ใช้เสียง `assets/voice/voice-tight.wav` (ไฟล์เสียงไม่ได้อยู่ใน git)

```bash
cd bang-dubai
node scripts/build-video.mjs      # สร้าง compositions/scene-0..7, fx, subs, index.html และ renders/bang-dubai-v1.srt
python3 scripts/make-audio.py     # สังเคราะห์ SFX + ดนตรีด้วย FFmpeg แล้วมิกซ์ใต้เสียงพากย์ (−16 LUFS)
hyperframes render -o renders/bang-dubai-v1-video.mp4 -f 30
ffmpeg -i renders/bang-dubai-v1-video.mp4 -i renders/bang-dubai-v1-mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest renders/bang-dubai-v1.mp4
```

- เวลาของแต่ละประโยคใน `assets/voice/lines-tight.json` (แปลงจากเวลาไฟล์ต้นฉบับตามจุดที่ตัดช่วงเงียบ ตรวจซ้ำกับ faster-whisper)
- ซับไทยแสดงทีละกลุ่มคำ (ตัดคำด้วย `Intl.Segmenter`) ไม่แยกสระ/วรรณยุกต์ อยู่เหนือขอบล่าง 330px และเว้นขอบขวา
- น้ำมันพุ่งเป็นแอนิเมชันเชิงกระบวนการใน `scripts/video/runtime.js` (`gusher`)
- `scripts/build.mjs` ตอนนี้สร้างเฉพาะภาพนิ่ง
