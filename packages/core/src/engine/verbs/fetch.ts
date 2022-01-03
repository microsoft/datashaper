export const fetchTest = async () => {
    try{
        const response = await fetch("http://localhost:3001/getUsers")
        return response.json() || [];
    } catch(error){
        return []
    }
}