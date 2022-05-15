// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Youtube {
    address private owner;
    struct Video {
        address owner;
        string video;
        string thumbnail;
        string description;
        string title;
        address[] likes;
        address[] views;
        uint256 id;
    }
    struct User {
        string name;
        User[] suscribers;
        Video[] videos;
        address[] suscribedTo;
    }
    mapping(address => User) public users;
    mapping(string => address) public lookup_table;
    event UploadVideo(bytes32 hash);
    Video[] public videos;

    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
    }

    function getAllVideos() public view returns (Video[] memory) {
        return videos;
    }

    function isRegistered(address user) public view returns (bool) {
        string memory name = users[user].name;
        return bytes(name).length != 0;
    }

    function register(string memory name) public {
        require(bytes(users[msg.sender].name).length <= 2);
        User storage user = users[msg.sender];
        user.name = name;
        lookup_table[name] = msg.sender;
    }

    function suscribe(address channel) public {
        require(bytes(users[msg.sender].name).length > 2);
        require(msg.sender != channel);
        User storage user = users[channel];
        User storage user2 = users[msg.sender];
        user.suscribers.push(users[msg.sender]);
        user2.suscribedTo.push(channel);
    }

    function getAddress(string memory name) public view returns (address) {
        return lookup_table[name];
    }

    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function numSuscribers(address name) public view returns (uint256) {
        return users[name].suscribers.length;
    }

    function isSuscribed(address name) public view returns (bool) {
        for (uint256 i; i < users[msg.sender].suscribedTo.length; i++) {
            if (users[msg.sender].suscribedTo[i] == name) {
                return true;
            }
        }
        return false;
    }

    function uploadVideo(
        string memory _video,
        string memory _thumbnail,
        string memory _desc,
        string memory _title
    ) public {
        address[] memory likes;
        address[] memory views;
        Video memory video = Video(
            payable(msg.sender),
            _video,
            _thumbnail,
            _desc,
            _title,
            likes,
            views,
            videos.length
        );
        User storage user = users[msg.sender];
        user.videos.push(video);
        videos.push(video);
    }

    function likeVideo(uint256 id) public {
        Video storage video = videos[id];
        video.likes.push(msg.sender);
    }

    function likeCount(uint256 id) public view returns (uint256) {
        return videos[id].likes.length;
    }

    function viewVideo(uint256 id) public payable {
        require(msg.value >= 100000000000000 wei, "Not enough eth");
        Video storage video = videos[id];
        payable(video.owner).transfer(msg.value);
        video.views.push(msg.sender);
    }

    function viewCount(uint256 id) public view returns (uint256) {
        return videos[id].views.length;
    }
}
