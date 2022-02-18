// check if field exist in req.body
const check_required_field = (required_fields) => (req, res, next) => {
    const missing_fields = required_fields.filter(required_field => {
        if (!req.body.hasOwnProperty(required_field)) {
            return required_field
        }
    })
    if (missing_fields.length > 0) {
        return res.status(500).json({message: `${missing_fields.toString()} are required!!`})
    }
    next()
}

// check if field is exists in req.query
const check_required_field_in_query = (required_field) => (req, res, next) => {
    const missing_fields = required_field.filter(required_field => {
        if (!req.query.hasOwnProperty(required_field)) {
            return required_field
        }
    })
    if (missing_fields.length > 0) {
        return res.status(500).json({message: `${missing_fields.toString()} are required!!`})
    }
    next()
}

module.exports = Object.assign({}, {check_required_field, check_required_field_in_query})