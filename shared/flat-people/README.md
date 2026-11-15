# flat-people

ตัวละครการ์ตูนแฟลต (หัวกลมสีพีช ผมดำ ตาจุด แก้มชมพู แขนขาก้านกลม เสื้อผ้าสีทึบ เงาวงรีใต้เท้า) สำหรับโปรเจกต์ HyperFrames / HTML / SVG / GSAP

Reusable flat-cartoon people. No dependencies. Works from Node ESM (build scripts) and in the browser via `<script type="module">`.

## ใช้งานเร็ว / Quick start

```js
import { createPerson, createMale, createFemale, mountPerson } from "./index.mjs";

// ผู้หญิง — ค่าเริ่มต้นพร้อมใช้
const a = createPerson({ gender: "female" });

// ตั้งสีเสื้อ / กางเกง
const b = createFemale({ shirtColor: "#e0b04a", pantsColor: "#2c3550" });

// ผู้ชาย + หนวด
const c = createMale({ shirtColor: "#4a7ab5", pantsColor: "#2b3142", mustache: true });

// ผู้หญิงผ้าซิ่น
const d = createFemale({
  hairStyle: "bun",
  shirtColor: "#e9dcc4",
  skirt: true,
  skirtColor: "#5a2340",
});
```

วาง `a.svg` ลงใน `<svg viewBox="0 0 200 530">` หรือใน `<g transform="translate(x y) scale(s)">` (จุดกึ่งกลาง x = 100, เท้าอยู่ที่ y = 520)

ในเบราว์เซอร์:

```html
<script type="module">
  import { mountPerson } from "./index.mjs";
  mountPerson("#stage", { gender: "male", shirtColor: "#3a8f6e", pantsColor: "#1f2a22" });
</script>
<div id="stage"></div>
```

จาก Node (สคริปต์ build):

```js
import { writeFileSync } from "node:fs";
import { toSvgDocument, createFemale } from "./index.mjs";
writeFileSync("person.svg", toSvgDocument(createFemale({ shirtColor: "#c45c6a" })));
```

คัดลอกทั้งโฟลเดอร์ `shared/flat-people/` ไปใส่โปรเจกต์อื่นได้เลย ไม่ผูกกับ tame-demo

## API

| ฟังก์ชัน | คืนค่า | คำอธิบาย |
|---|---|---|
| `createPerson(opts)` | `{ svg, id, hands, waist, pivots }` | API หลัก มีค่าเริ่มต้นตาม `gender` |
| `createMale(opts)` | เหมือนกัน | เท่ากับ `createPerson({ gender: "male", ... })` |
| `createFemale(opts)` | เหมือนกัน | เท่ากับ `createPerson({ gender: "female", ... })` |
| `character(opts)` | เหมือนกัน | ตัวสร้างระดับต่ำ ไม่ใส่สีเริ่มต้นตามเพศ (ใช้ใน tame-demo เพื่อให้หน้าตาเดิม) |
| `toSvgDocument(personOrOpts)` | สตริง `<svg>...</svg>` | ห่อเป็นไฟล์ SVG เดี่ยว |
| `mountPerson(el, opts)` | `{ ...person, el }` | แทรกเข้า DOM (เบราว์เซอร์) `el` เป็นโหนดหรือ selector |
| `mix(a, b, t)` | สี hex | ผสมสี |

`hands.L` / `hands.R` คือพิกัดปลายมือในเฟรมท้องถิ่น ใช้ผูกเชือกหรือของถือได้

## ตารางตัวเลือก

ตัวเลือกที่มี * ใช้กับ `createPerson` / `createMale` / `createFemale` — มีค่าเริ่มต้นแล้ว เรียกแค่ `{ gender }` ก็ได้

| ตัวเลือก | ชนิด | ค่าเริ่มต้น หญิง / ชาย | ความหมาย |
|---|---|---|---|
| `gender` | `"female"` \| `"male"` | `"female"` / — | แบบลำตัวและค่าเริ่มต้นของผม/เสื้อผ้า |
| `shirtColor` (หรือ `top`) | สี hex | `#e8899a` / `#4a7ab5` | สีเสื้อ |
| `pantsColor` (หรือ `pants`) | สี hex | `#3d3a5c` / `#2b3142` | สีกางเกง |
| `skirtColor` | สี hex | — | สีผ้าซิ่น/กระโปรง (ถ้าส่งมาโดยไม่ระบุ `skirt` จะใส่ผ้าซิ่นให้อัตโนมัติ) |
| `skirt` หรือ `bottom: "skirt"` \| `"pants"` | boolean / string | `false` | ผ้าซิ่น (pha sin) แทนกางเกง |
| `skirtBand` | สี hex | `#d8a64a` | แถบผ้าซิ่น |
| `skinColor` (หรือ `skin`) | สี hex | `#f4c7a1` | สีผิว |
| `hairColor` | สี hex | `#1b1312` | สีผม |
| `hairStyle` (หรือ `hair`) | `"bob"` \| `"long"` \| `"bun"` \| `"pony"` \| `"short"` | `bob` / `short` | ทรงผม |
| `shoeColor` (หรือ `shoes`) | สี hex | `#3a2620` | สีรองเท้า |
| `expression` | ชื่อท่าหน้า | `"neutral"` | ท่าหน้าเดียว |
| `expressions` | สตริง[] | `["neutral"]` | หลายท่าหน้า — อันแรกโชว์ ที่เหลือซ่อนไว้ให้สลับด้วย GSAP |
| `view` หรือ `pose` | `"front"` \| `"back"` | `"front"` | มุมมอง |
| `scale` | number | `1` | ขยายรอบเท้า (เท้าไม่เลื่อน) |
| `blink` | boolean | `true` | ติด `data-blink="on"` ที่ตา เพื่อให้รู้ว่ากระพริบได้ (ตาถูกวาดเสมอ) |
| `outfit` | `"shirt"` \| `"jacket"` \| `"farmer"` \| `"blouse"` | `"shirt"` | แบบเสื้อ (ชาวนามีผ้าขาวม้า, เสื้อบลลัซมีคอกลม) |
| `accent` | สี hex | `#f7efe2` | กระดุม / คอปก / ลายบลลัซ |
| `backpack` | boolean | `false` | เป้ (สายด้านหน้า / ใบด้านหลัง) |
| `packColor` | สี hex | `#6b4128` | สีเป้ |
| `hairClip` หรือ `tie` | boolean | `false` | กิ๊บติดผม |
| `clipColor` หรือ `accent2` | สี hex | `#c8282f` | สีกิ๊บ / ยางรัดผม |
| `mustache` / `moustache` | boolean | `false` | หนวด (ผู้ชาย) |
| `greyTemples` | boolean | `false` | ผมเทาที่ขมับ |
| `wrinkles` | boolean | `false` | ริ้วรอย |
| `halter` | boolean | `false` | ห่วงเชือกที่คอ |
| `sash` | สี hex | `#b8323a` | สีผ้าขาวม้า (`outfit: "farmer"`) |
| `armL` / `armR` | องศา | `8` | มุมแขน (0 = ห้อยลง, 90 = ชูออกข้าง) |
| `id` | string | สร้างอัตโนมัติ (`fp1`…) | คำนำหน้า id สำหรับ hook ของแอนิเมชัน — **ต้องไม่ซ้ำ** ในฉากเดียวกัน |
| `tint` + `tintAmt` | สี, 0..1 | ไม่มี | ย้อมแสงฉากเข้าทุกสี |
| `dark` | 0..1 | `0` | ทำให้มืดลง |
| `rim` + `rimSide` | สี, `"left"` \| `"right"` | ไม่มี | เส้นแสงริมลำตัวและหัว |
| `accessories` | object | — | ทางลัด: `{ backpack, hairClip, mustache, halter, wrinkles, greyTemples, sash, packColor, clipColor }` |

ท่าหน้าที่ใช้ได้: `neutral`, `smile`, `worried`, `shocked`, `fierce`, `angry`, `smirk`

## พรีเซ็ตจากเรื่อง TAME

```js
import { character, presets } from "./index.mjs";

character({ ...presets.khwan, id: "kw1" });       // ขวัญ — เสื้อเหลือง กางเกงกรมท่า เป้ กิ๊บแดง ผมบ็อบ
character({ ...presets.yot, id: "yt1" });         // น้ายศ — เสื้อม่อฮ่อม ผ้าขาวม้า หนวด ขมับเทา
character({ ...presets.ang, id: "ag1" });         // ยายอ่าง — ผมมวยเทา เสื้อครีม ผ้าซิ่นแดง
character({ ...presets.villagerMale, id: "v1" });
character({ ...presets.villagerFemale, id: "v2" });
```

ชื่อไทยใช้แทนกันได้: `presets["ขวัญ"]`, `presets["น้ายศ"]`, `presets["ยายอ่าง"]`

## Hook สำหรับ GSAP

id และคลาสต่อไปนี้คงที่ (อย่าเปลี่ยนเวลา animate)

| Hook | ใช้ทำอะไร |
|---|---|
| `#{id}-root` | ทั้งตัว (fade, เดินเข้าฉาก) |
| `#{id}-armL` / `#{id}-armR` | หมุนแขน — จุดหมุนอยู่ใน `data-pivot` เช่น `"56 238"` ใช้เป็น `svgOrigin` |
| `#{id}-legs` | ขา / ผ้าซิ่น / รองเท้า |
| `#{id}-headGroup` | พยักหน้า หรือเอียงหัว |
| `#{id}-eyes` | กระพริบตาด้วย `scaleY` |
| `#{id}-exp-{name}` และ `.{id}-exp` | สลับสีหน้า |
| `#{id}-torso` / `#{id}-head` | clipPath (อย่าไป animate id เหล่านี้ — ไม่ใช่กลุ่มหัว) |

ตัวอย่างกระพริบตาและเปลี่ยนสีหน้า (แบบเดียวกับที่ใช้ใน tame-demo):

```js
const blink = (sel, at) =>
  tl.fromTo(sel, { scaleY: 1 }, {
    scaleY: 0.12, transformOrigin: "50% 50%", duration: 0.06,
    yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false,
  }, at);

blink("#kw1-eyes", 0.7);

const face = (pre, name, at) => {
  tl.set(`.${pre}-exp`, { opacity: 0 }, at);
  tl.set(`#${pre}-exp-${name}`, { opacity: 1 }, at);
};
face("kw1", "worried", 1.8);

// แกว่งแขนระหว่างเดิน (มุมมองหลัง)
tl.fromTo("#kw1-armL", { rotation: 0 }, {
  keyframes: [{ rotation: 12 }, { rotation: -10 }, { rotation: 12 }],
  svgOrigin: "56 238",
}, 0.5);
```

ถ้า `blink: false` ตายังถูกวาด แต่มี `data-blink="off"` ให้สคริปต์ข้ามได้

## เฟรมพิกัด

`FRAME = { width: 200, height: 530, cx: 100, feetY: 520, shoulderL: [56, 238], shoulderR: [144, 238], armLen: 92 }`

## เดโม

เปิด `demo.html` ในเบราว์เซอร์ (ต้องเสิร์ฟเป็นโมดูล เช่น `python3 -m http.server`) หรือดูภาพรวมที่ `demo.png`

## ใช้ใน tame-demo

ซีน bind / road / turn เรียก `character()` ผ่าน `tame-demo/scripts/build-characters.mjs` ซึ่งอิมพอร์ตจากแพ็กเกจนี้ และใช้ `presets` เป็นคอนฟิกตัวละคร รันใหม่หลังแก้พรีเซ็ต:

```bash
cd tame-demo && node scripts/build-characters.mjs
```

`tame-demo/compositions/components/character.mjs` เป็นแค่ re-export ไม่มีลอจิกของตัวเอง
