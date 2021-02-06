module.exports = (message, permissions, role) => {

    const hasPerm = message.member.hasPermission(permissions)
    const hasRole = message.member.roles.cache.some((r) => r.name === role)

    if (permissions && role) {
        return hasPerm || hasRole
    } else if (permissions) {
        return hasPerm
    } else if (role) {
        return hasRole
    } else {
        return true
    }
}