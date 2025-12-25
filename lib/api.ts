/**
 * Helper untuk membuat authenticated API requests
 */

export interface FetchOptions extends RequestInit {
    includeAuth?: boolean
}

export async function authenticatedFetch(
    url: string,
    options: FetchOptions = {}
) {
    const { includeAuth = true, ...fetchOptions } = options

    const headers = new Headers(fetchOptions.headers)

    // Tambahkan Authorization header jika diperlukan
    if (includeAuth && typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
    }

    headers.set('Content-Type', 'application/json')

    return fetch(url, {
        ...fetchOptions,
        headers,
    })
}
