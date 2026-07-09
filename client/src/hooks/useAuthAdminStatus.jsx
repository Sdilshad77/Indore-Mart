import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"


const useAuthAdminStatus = () => {

    const { user } = useSelector(state => state.auth)

    const [isAdmin, setIsAdmin] = useState(false)
    const [checkAuthentication, setCheckAuthentication] = useState(true)

    useEffect(() => {
        user?.isAdmin ? setIsAdmin(true) : setIsAdmin(false)
        setCheckAuthentication(false)
    }, [user])


    return { isAdmin, checkAuthentication }

}

export default useAuthAdminStatus
