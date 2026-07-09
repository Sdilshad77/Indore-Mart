import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"


const useAuthStatus = () => {

    const { user } = useSelector(state => state.auth)

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [checkAuthentication, setCheckAuthentication] = useState(true)

    useEffect(() => {
        user ? setIsAuthenticated(true) : setIsAuthenticated(false)
        setCheckAuthentication(false)

    }, [user])


    return { isAuthenticated, checkAuthentication }

}

export default useAuthStatus
