import { useSearchParams } from "react-router"
import Gallery from "../components/Gallery"

const SearchPage = () => {
    const [searchParams]=useSearchParams()
    const searchQuery=searchParams.get('search') || ''
    
  return (
    <Gallery search={searchQuery}/>
  )
}

export default SearchPage