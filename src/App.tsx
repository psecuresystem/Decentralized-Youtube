import { useEffect, useLayoutEffect, useState } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import NavBar from './components/NavBar'
import UploadVideo from './components/UploadVideo'
import YourVideos from './components/YourVides'
import { ethers } from 'ethers'
import YoutubeContract from "./artifacts/contracts/Youtube.sol/Youtube.json"
import Video from './models/Video'
import VideoC from './components/Video'

function App() {
  const [count, setCount] = useState(0)
  const [account,setAccount] = useState(null)
  const [youtube,setYoutube] = useState<ethers.Contract>()
  const [videos,setVideos] = useState<Video[]>([])
  const [loading,setLoading] = useState(true)

  async function web3handler() {
    let acct,youtube2;
    if(window.ethereum){
      acct = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(acct[0])
      setAccount(acct[0])
      youtube2 = loadContracts(signer,acct[0])
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
  
      window.ethereum.on('accountsChanged', async function (accounts: any) {
        setAccount(accounts[0])
        loadContracts(signer,accounts[0])
      })
    }else{
      alert('Install metamask')
    }
    return youtube2
  }

  async function loadContracts(signer: ethers.Signer,account: string): Promise<ethers.Contract>{
      let youtubes = new ethers.Contract("0x14d49CF4d2199fb2Cef151D0692f8ecf7c4C5399",YoutubeContract.abi,signer)
      const registered = await youtubes.isRegistered(account)
      console.log(registered)
      if(!registered) {
        let name = prompt("Enter Username")
        await youtubes.register(name)
      }
      setLoading(false)
      return youtubes
  }

  async function loadVideos() {
    let videos = await youtube?.getAllVideos()
    return videos
  }

  async function loadVideos2() {
    let videos = await youtube?.getAllVideos()
    let yours =  videos.filter((video: any) => video[0].toLowerCase() == account)
    console.log('yours', yours)
    return yours
  }

  async function getName(address: string) {
    console.trace()
    return (await youtube!.users(address))
  }

  async function getVideo(id:number): Promise<Video> {
    let video = await youtube!.videos(id)
    return video
  }

  useLayoutEffect(() => {
    web3handler()
      .then((res) => {
        setYoutube(res)
      })
  },[])

  return (
    <div className="App">
      <BrowserRouter>
        {
          loading ? 
            <div>loading</div> :
            <Routes>
              <Route path='/' element={<Home loadVideos={loadVideos} getName={getName}/>}/>
              <Route path='/upload-video' element={<UploadVideo youtube={youtube!}/>}/>
              <Route path='/your-videos' element={<YourVideos loadVideos={loadVideos2} getName={getName}/>}/>
              <Route path='/video/:uri' element={<VideoC getVideo={getVideo}/>}/>
            </Routes> 
        }
        
      </BrowserRouter>
    </div>
  )
}

export default App
