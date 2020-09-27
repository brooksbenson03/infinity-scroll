class DomHelper {
  setAttributes(element, attributes) {
    for (let a in attributes) {
      element.setAttribute(a, attributes[a])
    }
  }
}

class Photo extends DomHelper {
  constructor(photoData, container) {
    super()
    this.photoData = photoData
    this.container = container
    this.linkElement = document.createElement('a')
    this.imageElement = document.createElement('img')

    this.setAttributes(this.linkElement, {
      href: photoData.links.html,
      target: "_blank",
    })

    this.setAttributes(this.imageElement, {
      src: photoData.urls.regular,
      alt: photoData.alt_description,
      title: photoData.alt_description,
    })
  }

  render() {
    this.linkElement.append(this.imageElement)
    this.container.appendChild(this.linkElement)
  }
}

class Photos {
  constructor() {
    this.loader = document.getElementById('loader')
    this.photoContainer = document.getElementById("image-container")
    this.isAddingPhotos = false
    this.unhandledPhotoData = []
    this.renderedPhotos = []
    this.addPhotos = this.addPhotos.bind(this)
    this.infiniteScroll = this.infiniteScroll.bind(this)
  }

  async fetchPhotoData() {
    const response = await fetch(
      "https://api.unsplash.com/photos/random/?client_id=wd_tiI1oTG1RUOBwojwOl-rkz7X9M6o_hpPE-WySCi0&count=10"
    )
    return await response.json()
  }

  async addPhotos() {
    if (this.isAddingPhotos) {
      return
    } else {
      this.isAddingPhotos = true
      this.loader.hidden = false
      this.unhandledPhotoData = await this.fetchPhotoData()
      this.unhandledPhotoData = this.unhandledPhotoData.map(data => new Photo(data, this.photoContainer))
      while (this.unhandledPhotoData.length) {
        this.unhandledPhotoData[0].render()
        this.renderedPhotos.push(this.unhandledPhotoData[0])
        this.unhandledPhotoData.shift()
      }
      this.isAddingPhotos = false
      this.loader.hidden = true
    }
  }

  infiniteScroll() {
    const scrolledAmount = window.innerHeight + window.scrollY
    const fetchPhotosTriggerPoint = document.body.offsetHeight - 1000
  
    if (scrolledAmount > fetchPhotosTriggerPoint) this.addPhotos()
  }
}

const photos = new Photos()

window.addEventListener('DOMContentLoaded', photos.addPhotos)
window.addEventListener('scroll', photos.infiniteScroll)
