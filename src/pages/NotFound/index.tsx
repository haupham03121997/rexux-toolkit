import { useEffect } from 'react'

export default function NotFound() {
    useEffect(() => {
        window.location.replace('https://vib.com.vn/404')
    }, [])

    return <div>index</div>
}
