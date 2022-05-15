const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

let Youtube;
let youtube;
let owner;
let addr1,addr2,addrs;
let provider = waffle.provider
beforeEach(async () => {
  const Youtube = await ethers.getContractFactory("Youtube");
  [owner,addr1,addr2,...addrs] = await ethers.getSigners()
  youtube = await Youtube.deploy()
})
describe("Account", function () {
  it("Should Register a user from name", async () => {
    const registerTx = await youtube.register("Vision")
    await registerTx.wait()
    expect(await youtube.lookup_table("Vision")).to.equal(owner.address)
  })
  it("Should suscribe to another account", async () => {
    let client = youtube.connect(addr1)
    let registerTx = await client.register("Chike");
    await registerTx.wait()
    let suscribeTx = await client.suscribe(await youtube.getAddress("Vision"))
    await suscribeTx.wait()
    expect(await youtube.numSuscribers(await youtube.getAddress("Vision"))).to.equal(1);
  })
});
describe("Video",() => {
  it("Should upload Video", async () => {
    let videoTx = await youtube.uploadVideo('hash');
    await videoTx.wait()
    let vid = await youtube.videos(0)
    expect(vid[0]).to.equal(owner.address)
  })
  it("Should view video", async () => {
    let videoTx = await youtube.uploadVideo('hash');
    await videoTx.wait()
    expect(await youtube.viewCount(0)).to.equal(0)
    let client = await youtube.connect(addr1)
    let oriBalance = await provider.getBalance(owner.address)
    let viewTx = await client.viewVideo(0,{
      value: ethers.utils.parseEther("0.1")
    });
    await viewTx.wait()
    expect(await youtube.viewCount(0)).to.equal(1)
    let newBalance = await provider.getBalance(owner.address)
    expect(newBalance.toString() == oriBalance.toString()).to.equal(false)
  })
  it("Should like video", async () => {
    let videoTx = await youtube.uploadVideo('hash');
    await videoTx.wait()
    expect(await youtube.likeCount(0)).to.equal(0)
    let client = await youtube.connect(addr1)
    let likeTx = await client.likeVideo(0);
    await likeTx.wait()
    expect(await youtube.likeCount(0)).to.equal(1)
  })
})
