const imageContainer = document.getElementById("image-container")
const loader = document.getElementById("loader")

function setAttrs(el, attrs) {
  for (let attr in attrs) {
    el.setAttribute(attr, attrs[attr])
  }
}

class Photos {
  constructor() {
    this.isAddingPhotos = false
    this.photos = []
  }

  async addPhotos() {
    if (this.isAddingPhotos) return
    this.isAddingPhotos = true
    const response = await fetch(
      "https://api.unsplash.com/photos/random/?client_id=wd_tiI1oTG1RUOBwojwOl-rkz7X9M6o_hpPE-WySCi0&count=10"
    )
    const photos = await response.json()
    this.photos = [...this.photos, ...photos]
    this.displayPhotos()
    this.isAddingPhotos = false
  }

  displayPhotos() {
    this.photos.forEach((p) => {
      const item = document.createElement("a")
      setAttrs(item, {
        href: p.links.html,
        target: "_blank",
      })
      const img = document.createElement("img")
      setAttrs(img, {
        src: p.urls.regular,
        alt: p.alt_description,
        title: p.alt_description,
      })
      item.append(img)
      imageContainer.appendChild(item)
    })
  }
}

const photos = new Photos()

window.addEventListener("scroll", () => {
  const scrolledAmount = window.innerHeight + window.scrollY
  const fetchPhotosTriggerPoint = document.body.offsetHeight - 1000

  if (scrolledAmount > fetchPhotosTriggerPoint) photos.addPhotos()
})

// on load
photos.addPhotos()
