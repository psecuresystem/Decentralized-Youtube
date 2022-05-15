import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Video from '../models/Video'

function VideoC({getVideo}: {getVideo: (id: number) => Promise<Video>}) {
  let id = useParams()["uri"]
  let [video,setVideo] = useState<Video>()
  let [loading,setloading] = useState(true)

  async function fetchVideo() {
    let video = await getVideo(+id!)
    setVideo(video)
    setloading(false)
  }
  useEffect(() => {
      fetchVideo()
  })
  return (
    <div className="single-video body">
        {
            loading ?
                <div>loading</div> :
                <>
                    <video src={`https://ipfs.infura.io/ipfs/${video?.video}`} controls ></video>
                    <div className="content">
                      <h2>{video?.title}</h2>
                      <p>{video?.description}</p>
                    </div>
                </>
        }
    </div>
  )
}

export default VideoC