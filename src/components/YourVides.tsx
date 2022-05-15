import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Video from "../models/Video"
import NavBar from "./NavBar"

let channels: string[] = []
function YourVideos({ loadVideos, getName }: { loadVideos: any, getName: any }) {
  let [videos,setVideos] =  useState<Video[]>([])
  const [loading,setLoading] = useState(true)
  let navigate = useNavigate()
  useEffect(() => {
    loadVideos()
        .then((res: any) => {
            res.map(async (video: Video,idx: number) => {
                channels.push(await getName(video.owner))
                console.log(channels)
                if(idx === res.length - 1){
                    channels = channels.slice(0,res.length)
                    setLoading(false)
                }
            })
            setVideos(res)
            setLoading(false)
        })
  },[])
  return (
    <div className="body">
        <NavBar active={3}/>
        {
            loading ? 
                <div>loading</div> : 
                <>
                    <h1 className="header">Your Videos</h1>
                    <div className="videos">
                        {
                            videos.map((video,idx) => {
                                return <div className="video" key={idx} onClick={() => {
                                    navigate(`/video/${idx}`)
                                }}>
                                    <img 
                                        src={`https://ipfs.infura.io/ipfs/${video.thumbnail}`}
                                        alt="new"
                                    />
                                    <div className="details">
                                        <h4>{video.title}</h4>
                                        <p>{channels[idx]}</p>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </>
        }
    </div>
  )
}

export default YourVideos