function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function compress(img, { format, quality, scale }) {
  const canvas = document.createElement('canvas')
  canvas.width  = Math.round(img.naturalWidth  * scale / 100)
  canvas.height = Math.round(img.naturalHeight * scale / 100)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg'
  const dataUrl = canvas.toDataURL(mime, quality / 100)
  const bytes = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 3 / 4)
  return { dataUrl, bytes }
}

function calcQuality(img, { format, maxBytes, scale }) {
  if (format === 'png') return 100
  let lo = 1, hi = 100
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const { bytes } = compress(img, { format, quality: mid, scale })
    if (bytes <= maxBytes) lo = mid; else hi = mid - 1
  }
  return lo
}

function formatBytes(n) {
  return n.toLocaleString() + ' bytes'
}

function imageCompress() {
  return {
    original: null,
    compressed: null,
    imgEl: null,
    format: 'jpeg',
    maxMB: 1,
    quality: 80,
    scale: 100,
    originalSize: 0,
    compressedSize: 0,

    get compressedSmaller() { return this.compressedSize < this.originalSize },
    get base64Bytes() { return this.compressed ? formatBytes(this.compressedSize) : '' },

    async onFile(e) {
      const file = e.target.files[0]
      if (!file) return
      this.imgEl = await loadImage(file)
      this.original = this.imgEl.src
      this.originalSize = file.size
      this.quality = calcQuality(this.imgEl, { format: this.format, maxBytes: this.maxMB * 1024 * 1024, scale: this.scale })
      await this.process()
    },

    async onDrop(e) {
      const file = e.dataTransfer.files[0]
      if (!file || !file.type.startsWith('image/')) return
      this.imgEl = await loadImage(file)
      this.original = this.imgEl.src
      this.originalSize = file.size
      this.quality = calcQuality(this.imgEl, { format: this.format, maxBytes: this.maxMB * 1024 * 1024, scale: this.scale })
      await this.process()
    },

    async process() {
      if (!this.imgEl) return
      const { dataUrl, bytes } = compress(this.imgEl, { format: this.format, quality: this.quality, scale: this.scale })
      this.compressed = dataUrl
      this.compressedSize = bytes
    },

    download() {
      const a = document.createElement('a')
      a.href = this.compressed
      a.download = 'compressed.' + (this.format === 'jpeg' ? 'jpg' : this.format)
      a.click()
    },

    async copyBase64() {
      await navigator.clipboard.writeText(this.compressed)
    },

    init() {
      this.$watch('format',  () => this.process())
      this.$watch('maxMB',   () => this.process())
      this.$watch('quality', () => this.process())
      this.$watch('scale',   () => this.process())
    }
  }
}
