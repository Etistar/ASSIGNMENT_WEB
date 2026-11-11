const getUniqueErrorMessage = (err) => {
  const message = err.message || ''
  const indexMatch = message.match(/index:\s+([^\s]+)/)
  if (indexMatch) {
    const fieldName = indexMatch[1].replace(/_1$/, '').replace(/_-1$/, '')
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'
  }
  return 'Unique field already exists'
}

const getErrorMessage = (err) => {
  if (!err) return 'Something went wrong'
  if (err.code === 11000 || err.code === 11001) {
    return getUniqueErrorMessage(err)
  }
  if (err.errors) {
    for (const errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message
    }
  }
  return err.message || 'Something went wrong'
}

export default { getErrorMessage }
