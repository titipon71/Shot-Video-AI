# Video configs

หนึ่งไฟล์ JSON = หนึ่งคลิป แผนที่ระบายสีทีละกลุ่มประเทศ (สไตล์ใน `../../style_template_geoglobetales.md`)

## สร้างคลิป

```bash
npm run video -- videos/europe-regions.json --dry      # ตรวจ config + ดูมุมกล้อง (ไม่ bake)
npm run video -- videos/europe-regions.json --stills   # ภาพนิ่งตอนกล้องหยุดของทุกฉาก (~5 วิ/ฉาก) ไว้เช็กเฟรมก่อน bake จริง
npm run video -- videos/europe-regions.json            # bake แผนที่ + สร้าง HTML + lint
npm run video -- videos/europe-regions.json --render   # ... แล้ว render เป็น renders/<id>.mp4
npx hyperframes preview                                 # ดูใน Studio ก่อน render
```

- `--force` bake ใหม่ทุกฉาก, `--only=intro,west` bake เฉพาะบางฉาก
- ฉากที่กล้อง/ขนาด/ประเทศไม่เปลี่ยน จะข้ามการ bake อัตโนมัติ (แก้แค่ข้อความ = ไม่ต้อง bake ใหม่)
- โปรเจกต์ถือคลิปได้ทีละคลิป: `make` จะเขียน `index.html` และ `compositions/` ทับของคลิปก่อน
- bake ใช้ภาพ tile จากอินเทอร์เน็ต ประมาณ 1.5 นาทีต่อฉาก; render ประมาณ 4 นาทีต่อ 40 วินาที

## รูปแบบ config

```jsonc
{
  "id": "europe-regions",          // ชื่อไฟล์ผลลัพธ์ (a-z 0-9 -) ไม่ใส่ = ชื่อไฟล์ json
  "width": 1080, "height": 1920,   // ไม่ใส่ = แนวตั้ง 1080x1920
  "style": "satellite",            // satellite | dark | light
  "regions": {                     // กลุ่มประเทศ: key ใช้อ้างใน scenes[].reveal
    "north": { "label": "Northern Europe", "color": "#4FC3E8", "countries": ["Norway", "Sweden"] }
  },
  "scenes": [
    { "id": "intro", "type": "intro", "dur": 5, "hero": "4 REGIONS", "lines": ["บรรทัดที่ 1", "บรรทัดที่ 2"] },
    { "id": "north", "reveal": "north", "dur": 5.5, "lines": ["...", "..."] },
    { "id": "outro", "type": "outro", "dur": 6, "lines": ["...", "now you know"] }
  ]
}
```

| ฟิลด์ฉาก | ความหมาย |
|---|---|
| `id` | ชื่อฉาก (a-z 0-9 -) ไม่ซ้ำกัน |
| `type` | `intro` (ฉากแรก: ข้อความใหญ่ขึ้นทันที, ทุกประเทศขึ้นสีขาว), `region` (เผยหนึ่งกลุ่ม), `outro` (ทุกกลุ่มมีสี + ป้ายสรุป). ไม่ใส่ = ฉากแรกเป็น intro, ฉากสุดท้ายที่ไม่มี reveal เป็น outro, ที่เหลือเป็น region |
| `reveal` | key ของ region ที่ระบายสีในฉากนี้ (outro ใส่ได้ ถ้าจะเผยกลุ่มสุดท้ายตอนจบ) |
| `dur` | ความยาวฉาก (วินาที) ประมาณ 5–6.5 ให้ซับอ่านทัน |
| `hero` | ข้อความตัวใหญ่ (ไม่ใส่ = ชื่อ region) |
| `lines` | ซับ 2 บรรทัด: บรรทัดแรกขึ้นตอนกล้องหยุด, บรรทัดที่สองครึ่งหลังของฉาก; สั้น ๆ ไม่เกิน ~5 คำ |
| `camera` | ไม่ใส่ = จัดเฟรมอัตโนมัติจากขอบเขตประเทศ. ใส่เองได้: `center` [lon, lat], `zoom`, `zstart`, `move` (วินาทีที่กล้องเคลื่อน, ค่าเริ่ม 1.5), `fill` (ความกว้างที่ให้กลุ่มกินจอ, ค่าเริ่ม 0.78) |

## ชื่อประเทศ

ต้องสะกดตาม world-atlas (Natural Earth 110m) เช่น `"Czechia"`, `"Macedonia"`, `"Bosnia and Herz."`, `"Dem. Rep. Congo"`, `"United States of America"`

```bash
npm run countries            # ทั้งหมด 177 ประเทศ
npm run countries -- congo   # ค้นหา
```

ถ้าสะกดผิด `make` จะหยุดก่อน bake และเสนอชื่อที่ใกล้เคียง ข้อจำกัด: ไม่มีประเทศเล็กมาก (สิงคโปร์, บาห์เรน, มัลดีฟส์, นครรัฐในยุโรป) และไม่มีขอบเขตระดับจังหวัด/รัฐ
ประเทศที่ข้ามเส้นแบ่งวันหรือกว้างมาก (รัสเซีย) ทำให้กล้องอัตโนมัติซูมออกไกล ใส่ `camera` เองจะคุมได้ดีกว่า

## คลิปเล่าเรื่อง (`"kind": "story"`)

ใช้กับคลิปที่มีบทพูด เช่น `thai-history-p1.json` แต่ละฉากต้องมี `say` (บทพูดของฉาก) ทุกอย่างในฉากจะขึ้นตาม **cue** ซึ่งเป็นวลีในบทพูด

- ถ้ายังไม่มีเสียง เวลาของ cue ประมาณจากความเร็วพูด `cps` (ตัวอักษรต่อวินาที ไม่นับเว้นวรรค ค่าเริ่ม 13) ส่วนความยาวฉากคิดจากจำนวนตัวอักษรของ `say`
- ถ้ามีเสียง (`voice`) ความยาวฉาก จุดตัดฉาก cue ทุกตัว และซับ จะมาจากเวลาจริงในเสียง (ดูหัวข้อถัดไป)
- ซับจะตัดเป็นวลีจากบทพูดให้อัตโนมัติ ตัดตามเว้นวรรคและขอบคำไทย ถ้ามีคำที่ไม่อยากให้ถูกตัดกลาง ใส่ไว้ใน `keep` ของฉาก
- กล้องจะ bake เฉพาะช่วงที่เคลื่อน (`camera.move` วินาที) แล้วใช้ภาพนิ่งตลอดช่วงที่เหลือ ช่วงที่เคลื่อนจะบินแบบซูมออกแล้วซูมเข้า (flyTo)

```jsonc
{
  "kind": "story", "cps": 13,
  "places": { "sukhothai": { "name": "สุโขทัย", "at": [99.70, 17.02] }, "wp1": { "at": [125.8, 31.6] } },
  "scenes": [{
    "id": "s6-fleets",
    "say": "ในปี ค.ศ. 1274 และ ค.ศ. 1281 ...",
    "camera": { "fit": ["ningbo", "hakata"], "fill": 0.72, "move": 2 },     // หรือ center + zoom
    "year": [{ "ad": 1274, "cue": "ค.ศ. 1274" }, { "ad": 1281, "cue": "ค.ศ. 1281" }],  // หรือ "ข้อความ" / { "text": ... }
    "fills":  [{ "countries": ["China"], "color": "#E5452B", "opacity": 0.5, "cue": "...", "label": "หยวน", "labelAt": "place" }],
    "pins":   [{ "place": "hakata", "color": "#fff", "cue": "...", "side": "right|left|top|bottom", "label": "" }],
    "routes": [{ "via": ["masan", "tsushima", "hakata"], "color": "#E5452B", "cue": "...", "draw": 1.2, "dashed": false, "label": "1274", "labelAt": "place", "arrow": true }],
    "icons":  [{ "place": "takashima", "cue": "ไต้ฝุ่น", "size": 1.4 }],               // พายุหมุน
    "texts":  [{ "text": "神風", "style": "hero|sub|tag|kanji", "cue": "...", "outCue": "...", "y": 300, "color": "#fff" }],
    "images": [{ "src": "assets/images/<id>/05-kublai.jpg", "cue": "กุบไลข่าน", "outCue": "กองทัพเรือ", "credit": "ภาพ: ชื่อ / CC BY 4.0" }]  // หรือ "dur": 3.5 แทน outCue
  }]
}
```

- `cue` ใช้ `at` (วินาทีในฉาก) แทนได้
- ป้ายปีจะค้างจากฉากก่อนหน้าไว้ ถ้าฉากใหม่ไม่ได้กำหนดปีของตัวเอง
- `places` ที่ไม่มี `name` ใช้เป็นจุดผ่านของเส้นทางได้ ใช้วางเส้นเรือให้อ้อมแผ่นดิน

### รูปประกอบ (`images`)

- วางรูปไว้ที่ `assets/images/<id>/` พร้อม `index.md` บอกช่วงบท ที่มา และ license ของแต่ละรูป
- รูปขึ้นเป็นการ์ดกรอบขาวกลางจอ (ระหว่างหัวข้อกับซับ) ตอน `cue` แล้วหายตอน `outCue` (หรือหลัง `dur` วินาที ค่าเริ่ม 3.5) แสดงเต็มรูปไม่ครอป
- `credit` ขึ้นใต้รูป ต้องใส่สำหรับรูป CC BY / CC BY-SA, รูปสาธารณสมบัติไม่ต้อง
- ถ้าชนกับข้อความด้านบน ปรับกรอบด้วย `top` / `bottom` (px, ค่าเริ่ม 450 / 1240) หรือ `maxW` (ค่าเริ่ม 880)
- การ์ดบังแผนที่ช่วงที่ขึ้น ระวังอย่าให้ทับช่วงที่เส้นทางหรือสีประเทศกำลังขึ้น

### ใส่เสียงพากย์

1. วางไฟล์เสียงทั้งคลิปไว้ที่ `assets/voice/<id>.wav` (หรือ .mp3/.m4a) อ่านตาม `say` ของแต่ละฉาก เว้นช่วงสั้น ๆ ระหว่างฉาก
2. ถอดเสียงเป็นคำพร้อมเวลา (ครั้งแรกต้องติดตั้ง faster-whisper ตามหัวไฟล์ `scripts/story/transcribe.py`):
   ```bash
   .cache/whisper-venv/Scripts/python scripts/story/transcribe.py assets/voice/<id>.wav assets/voice/<id>.words.json
   ```
3. ใส่ใน config: `"voice": { "audio": "assets/voice/<id>.wav", "transcript": "assets/voice/<id>.words.json" }` แล้วรัน `npm run video` ตามปกติ

- ข้อความที่ถอดได้ไม่ต้องถูกทุกคำ ระบบจับคู่กับ `say` ทีละตัวอักษร แล้วใช้เวลาจากตัวที่ตรงกัน ถ้าฉากไหนตรงกันไม่ถึง 50% จะเตือน (มักแปลว่าอ่านต่างจากบทมาก ให้แก้ `say` ให้ตรงเสียง)
- ฉากตัดตรงช่วงเงียบก่อนคำแรกของฉาก ฉากสุดท้ายค้างต่อ 1.2 วินาทีหลังคำสุดท้าย
- ซับที่ขึ้นไม่ถึง 1.5 วินาทีจะรวมกับบรรทัดข้างเคียง (ไม่เกิน 44 ตัวอักษร หรือสองบรรทัด)
- ไฟล์เสียงไม่ขึ้น git ส่วน `.words.json` ขึ้น

## ให้ AI เขียน config

> เขียน config ตาม videos/README.md สำหรับคลิป "<หัวข้อ>" 4–6 ฉาก ใช้ชื่อประเทศตาม `npm run countries` แล้วรัน `npm run video -- videos/<id>.json --dry` จนผ่าน
