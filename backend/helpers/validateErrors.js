const validateCreate=(dataModel)=> {
    const res = dataModel.validateSync()
    if (res) {
        const errors = Object.keys(res.errors).map(path => {
            return (`Error in '${path}' : it must '${res.errors[path].kind}' and the value '${res.errors[path].value}' not match the conditions`)
        })
        return { errors, error: true , success:false }
    }
    return { error: false }
}
module.exports = validateCreate