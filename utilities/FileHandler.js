const fs = require('fs');

class FileHandler {
  constructor (filename) {
    this.filename = filename
  }

  async save(dataObject) {

    const firstAddition = async () => {
      const firstID = 1
      const newBodyOfObject = [
        {...dataObject, id: firstID}
      ]

      try {
        await fs.promises.appendFile(
          this.filename, 
          JSON.stringify(newBodyOfObject, null, 2)
        ) 

        return firstID

      } catch (error) {
        console.log(`Ha ocurrido un error en añadir el primer objeto`);
      }
    }

    const addAfter = async (fileContent) => {
      const bodyContentOfFile = JSON.parse(fileContent)

      const lastID = bodyContentOfFile[bodyContentOfFile.length - 1]?.id 
      const newID = lastID + 1

      try {
        await fs.promises.writeFile(
          this.filename,
          JSON.stringify(
            [
              ...bodyContentOfFile,
              {
                ...dataObject,
                id: newID
              }
            ],
            null, 2)
        ) 

        return newID

      } catch (error) {
        console.log(`Ha ocurrido un error al añadir el objeto`);
      }
    }

    try {
      // Check if the file exists
      await fs.promises.access(this.filename)
    } catch ( error ) {
      // Create the file if it doesn't exist
      await fs.promises.writeFile(this.filename, '')
    }

    const fileContent = await fs.promises.readFile(this.filename, 'utf-8')
    const isFileEmpty = fileContent.length === 0;
    return isFileEmpty ? firstAddition() : addAfter(fileContent)
  } 

  async getByID(id) {
    try {
      const fileContent = await fs.promises.readFile(this.filename, 'utf-8')
      const bodyOfFile = JSON.parse(fileContent)
      const item = bodyOfFile.filter(item => item.id == id);
      return item.length ? item : null

    } catch (error) { console.log(error) }
  } 

  async getAll() { 
    try {
      const fileContent = await fs.promises.readFile(this.filename, 'utf-8')
      const bodyOfFile = fileContent.length ? JSON.parse(fileContent) : [] 
      return bodyOfFile
    } catch (error) { console.log(error); }
  } 

  async deleteByID(id) {
    try {
      const fileContent = await fs.promises.readFile(this.filename, 'utf-8')
      const bodyOfFile = JSON.parse(fileContent)

      if (bodyOfFile.some(item => item.id === id)) {
        const filteredData = bodyOfFile.filter(item => item.id !== id)
        const newData = filteredData.length === 0 ? "" : JSON.stringify(filteredData, null, 2)
        await fs.promises.writeFile(this.filename, newData)
      } else { null }
      
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.filename, "")
    } catch (error) {
      console.log(error);
    }
  }

  pickRandom() {
    const fileInfo = fs.readFileSync(this.filename, 'utf-8')
    const products = JSON.parse(fileInfo)
    const randomIndex = Math.floor(Math.random()*products.length)
    return {...products[randomIndex]}
  }

  test() {
    console.log(`[SUCCESS]: Se ha conectado con la base de datos ${this.filename}`)
  }
}

module.exports.FileHandler = FileHandler 