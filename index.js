const express = require("express")
const app = express()
const port = 3000
const publics = express.static("public")

app.use(publics)
app.listen(port, () => {
  console.log("Listening...")
})
