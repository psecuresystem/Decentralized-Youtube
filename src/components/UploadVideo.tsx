import { ethers } from "ethers"
import { ChangeEvent, LegacyRef,  Ref,  useEffect,  useRef, useState } from "react"
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import NavBar from "./NavBar";

let ipfs: IPFSHTTPClient | undefined;
try {
  ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",

  });
} catch (error) {
  console.error("IPFS error ", error);
  ipfs = undefined;
}
function UploadVideo({ youtube }: { youtube: ethers.Contract }) {
  const videoRef: Ref<HTMLInputElement> = useRef(null);
  const thumbnailRef: Ref<HTMLInputElement> = useRef(null);
  const [thumbnail,setThumbnail] = useState<string>('')
  const [video,setVideo] = useState<string>('')
  const [title,setTitle] = useState<string>('')
  const [description,setDescription] = useState<string>('')

  async function handleClick(e: any) {
    e.preventDefault()
    await youtube.uploadVideo(video,thumbnail,description,title)
    alert('Success')
  }

  async function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      let file: any = (e.target as HTMLInputElement).files![0];
      if(!file) {
        alert('No file selected')
      }else {
        const result = await (ipfs as IPFSHTTPClient).add(file);
        console.log(result)
        setVideo(result.path);
        console.log(result.path)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleThumbnailChange(e: ChangeEvent<HTMLInputElement>) {
    let file: any = (e.target as HTMLInputElement).files![0];
    if(!file) {
      alert('No file selected')
    }else {
      const result = await (ipfs as IPFSHTTPClient).add(file);
      setThumbnail(result.path);
      console.log(result.path)
    }
  }

  useEffect(() => {
    console.log(youtube)
  },[youtube])

  return (
    <div className="body">
        <NavBar active={2}/>
        <h1 className="header">Upload Video</h1>
        <form>
            <input type="file" name="" id="" ref={thumbnailRef} onChange={e => {
              handleThumbnailChange(e);
            }}/>
            <div className="file" onClick={() => {
              thumbnailRef.current?.click()
            }}>Choose Thumbnail {thumbnail}</div>
            <input type="file" name="" id="" ref={videoRef} onChange={e => {
              handleVideoChange(e);
            }}/>
            <div className="file" onClick={() => {
              videoRef.current?.click()
            }}>Choose Video {video}</div>
            <input type="text" placeholder="Title" onChange={e => setTitle(e.target.value)}/>
            <input type="text" placeholder="Description" onChange={e => setDescription(e.target.value)}/>
            <button type="submit" onClick={handleClick}>Upload Video</button>
        </form>
    </div>
  )
}

export default UploadVideo