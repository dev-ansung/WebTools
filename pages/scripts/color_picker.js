// All 148 CSS named colors — grey/gray aliases included, deduped by hex at build time
const CSS_COLORS = [
  'aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black',
  'blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse',
  'chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan',
  'darkgoldenrod','darkgray','darkgrey','darkgreen','darkkhaki','darkmagenta','darkolivegreen',
  'darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue',
  'darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue',
  'dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia',
  'gainsboro','ghostwhite','gold','goldenrod','gray','grey','green','greenyellow','honeydew',
  'hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen',
  'lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray',
  'lightgrey','lightgreen','lightpink','lightsalmon','lightseagreen','lightskyblue',
  'lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen',
  'linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple',
  'mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred',
  'midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive',
  'olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise',
  'palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple',
  'rebeccapurple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown',
  'seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','slategrey',
  'snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet',
  'wheat','white','whitesmoke','yellow','yellowgreen'
]

class ColorMath {
  static _ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d')

  static nameToHex(name) {
    this._ctx.fillStyle = name
    return this._ctx.fillStyle
  }

  static hexToRgb(hex) {
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
  }

  static hsvToRgb(h, s, v) {
    s /= 100; v /= 100
    const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)) }
    return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
  }

  static rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const v = Math.max(r, g, b), d = v - Math.min(r, g, b), s = v === 0 ? 0 : d / v
    let h = 0
    if (d !== 0) {
      if (v === r)      h = ((g - b) / d) % 6
      else if (v === g) h = (b - r) / d + 2
      else              h = (r - g) / d + 4
      h = h * 60
      if (h < 0) h += 360
    }
    return [h, s * 100, v * 100]
  }

  static rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6
      else if (max === g) h = ((b - r) / d + 2) / 6
      else                h = ((r - g) / d + 4) / 6
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  }

  static dist(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
  }
}

class ColorDatabase {
  constructor() {
    const seen = new Set()
    this.colors = CSS_COLORS.flatMap(name => {
      const hex        = ColorMath.nameToHex(name)
      if (seen.has(hex)) return []   // skip grey/gray duplicates
      seen.add(hex)
      const [r, g, b]  = ColorMath.hexToRgb(hex)
      const [h, hs, l] = ColorMath.rgbToHsl(r, g, b)
      const [, vs, v]  = ColorMath.rgbToHsv(r, g, b)
      return [{
        name, hex, r, g, b,
        rgbStr: `${r}, ${g}, ${b}`,
        hslStr: `${h}°, ${hs}%, ${l}%`,
        hsvStr: `${Math.round(h)}°, ${Math.round(vs)}%, ${Math.round(v)}%`,
      }]
    })
  }

  findNearest(r, g, b, n = 1) {
    return this.colors
      .map(c => ({ ...c, dist: ColorMath.dist(r, g, b, c.r, c.g, c.b) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, n)
  }
}

const db = new ColorDatabase()

function colorPicker() {
  return {
    h: 200, sx: 60, sy: 70,
    dragTarget: null,
    copied: false,

    get pickedRgb() { return ColorMath.hsvToRgb(this.h, this.sx, this.sy) },
    get nearest()   { const [r, g, b] = this.pickedRgb; return db.findNearest(r, g, b, 1)[0] },
    get nearby()    { const [r, g, b] = this.pickedRgb; return db.findNearest(r, g, b, 8) },

    startDrag(target, e)  { this.dragTarget = target; this.updateFromEvent(e) },
    onDrag(e)             { if (this.dragTarget) this.updateFromEvent(e) },
    stopDrag()            { this.dragTarget = null },

    updateFromEvent(e) {
      if (this.dragTarget === 'sl') {
        const r = this.$refs.slBox.getBoundingClientRect()
        this.sx = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100))
        this.sy = Math.max(0, Math.min(100, (1 - (e.clientY - r.top) / r.height) * 100))
      } else if (this.dragTarget === 'h') {
        const r = this.$refs.hueBar.getBoundingClientRect()
        this.h  = Math.max(0, Math.min(360, (e.clientX - r.left) / r.width * 360))
      }
    },

    jumpTo(c) {
      const [h, s, v] = ColorMath.rgbToHsv(c.r, c.g, c.b)
      this.h = h; this.sx = s; this.sy = v
    },

    async copy(text) {
      await navigator.clipboard.writeText(text)
      this.copied = true
      setTimeout(() => this.copied = false, 1500)
    }
  }
}
