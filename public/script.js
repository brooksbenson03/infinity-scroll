class Photo {
  constructor(photoData, photoContainer) {
    this.photoData = photoData
    this.photoElement = this.createPhotoElement(photoData)
    this.photoContainer = photoContainer
  }

  createPhotoElement(photoData) {
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', photoData.links.html)
    linkElement.setAttribute('target', '_blank')

    const imageElement = document.createElement('img')
    imageElement.setAttribute('src', photoData.urls.regular)
    imageElement.setAttribute('alt', photoData.alt_description)
    imageElement.setAttribute('title', photoData.alt_description)

    linkElement.append(imageElement)

    return linkElement
  }

  render() {
    this.photoContainer.appendChild(this.photoElement)
  }
}

class Photos {
  constructor() {
    this.isAddingPhotos = false
    this.loader = document.getElementById('loader')
    this.photoContainer = document.getElementById("image-container")
    this.unrenderedPhotos = []
    this.renderedPhotos = []
    this.addPhotos = this.addPhotos.bind(this)
    this.infiniteScroll = this.infiniteScroll.bind(this)
  }

  async getNewPhotos() {
    const response = await fetch(
      "https://api.unsplash.com/photos/random/?client_id=wd_tiI1oTG1RUOBwojwOl-rkz7X9M6o_hpPE-WySCi0&count=10"
    )
    this.unrenderedPhotos = await response.json()
    this.unrenderedPhotos = this.unrenderedPhotos.map(data => new Photo(data, this.photoContainer))
  }

  async addPhotos() {
    if (this.isAddingPhotos) {
      return
    } else {
      this.isAddingPhotos = true
      this.loader.hidden = false
      await this.getNewPhotos()
      while (this.unrenderedPhotos.length) {
        this.unrenderedPhotos[0].render()
        this.renderedPhotos.push(this.unrenderedPhotos[0])
        this.unrenderedPhotos.shift()
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
