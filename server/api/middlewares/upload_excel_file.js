const multer = require('multer')

const path = __dirname + '/../../data'

const excelFilter = (req, file, cb) => {
    if (
        file.mimetype.includes('excel') ||
        file.mimetype.includes('spreadsheetml')
    ) {
        cb(null, true)
    } else {
        cb({message: 'upload only excel file'}, false)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path)
    },
    filename: (req, file, cb) => {
        cb(null, `list_component_${Date.now()}.xlsx`)
    }
})

const upload_excel_file = multer({storage: storage, fileFilter: excelFilter})

module.exports = upload_excel_file