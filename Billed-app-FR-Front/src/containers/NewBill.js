import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    this.formNewBill = formNewBill
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = e => {
    e.preventDefault()
    return this.checkImage()
    
  }

  checkImage = e => {
    const fileInput = this.document.querySelector(`input[data-testid="file"]`)
    const filePath = fileInput.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    const imgExtension = ['jpg', 'jpeg', 'png']
    const fileExtension = fileName.split('.').pop()
    const isImage = imgExtension.includes(fileExtension)
    // Fix [Bug Hunt] - Bills **********************************************************************
    if(isImage) {
      fileInput.setCustomValidity("")
      fileInput.reportValidity()
      this.fileUrl = filePath
      this.fileName = fileName

      return true
    } else {
      fileInput.setCustomValidity("Format d'image invalide")
      fileInput.value = ''
      fileInput.reportValidity()

      return false
    }   
  }

  handleSubmit = e => {
    e.preventDefault()
    this.checkImage()

    const formData = new FormData(this.formNewBill)

    formData.set('email', JSON.parse(localStorage.getItem("user")).email)
    formData.set('status', 'pending') 
    formData.set('file', document.querySelector('[name="file"]').files[0])

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then((response) => {
        this.billId = response.key
        this.fileUrl = response.fileUrl
        this.fileName = response.fileName
      }).catch(console.error)
      
      this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}