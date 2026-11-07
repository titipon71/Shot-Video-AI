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

## ให้ AI เขียน config

> เขียน config ตาม videos/README.md สำหรับคลิป "<หัวข้อ>" 4–6 ฉาก ใช้ชื่อประเทศตาม `npm run countries` แล้วรัน `npm run video -- videos/<id>.json --dry` จนผ่าน
