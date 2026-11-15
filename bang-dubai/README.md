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
