// Helper untuk mengecek dan mengelola token dari localStorage
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token')
    }
    return null
}

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user')
        try {
            return userData ? JSON.parse(userData) : null
        } catch {
            return null
        }
    }
    return null
}

export const setAuthToken = (token: string, user: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
    }
}

export const clearAuth = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}
