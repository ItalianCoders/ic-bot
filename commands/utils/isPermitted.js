const { developerRole } = require("../../settings.json");

const hasRole = (message, role) => {
    return message.member.roles.cache.some((r) => r.name === role)
}

const isDeveloper = (message) => {
    return hasRole(message, developerRole)
}

module.exports.hasRole

module.exports.isDeveloper

module.exports.isPermitted = (message, permissions, role) => {

    if (isDeveloper(message)) return true

    const memberPerm = message.member.hasPermission(permissions)
    const memberRole = hasRole(message, role)

    if (permissions && role) {
        return memberPerm || memberRole
    } else if (permissions) {
        return memberPerm
    } else if (role) {
        return memberRole
    } else {
        return true
    }
}