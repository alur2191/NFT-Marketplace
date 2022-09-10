# NFT-Marketplace

3D NFT marketplace in a browser. Side project that I revisit every few months when I have spare time. Feel free to reach out if you would like to join the fun and help me building this [alur2191@gmail.com](mailto:alur2191@gmail.com)

I thought of working on this a few years ago when I was looking into [Solidity](https://docs.soliditylang.org/en/v0.8.17/) and [Three.js](https://threejs.org/). I took some time to make the [3D environment](https://github.com/dandavisjs/3dGallery) at the time, and part of it is being used in this repo.

## Usage

### Running the frontend application

Navigate to the `frontend` and enter `npm run dev` which will run the application on the port 3000 by default.

### Marketplace

In your browser, navigate to - `http://localhost:3000/`

To view the NFT's you will need to connect to Blockchain. You can use [Metamask](https://metamask.io/) or any other browser extension wallet listed in the "Connect a Wallet" pop-up on our marketplace website. To learn more about how the marketplace works please read [this guide](https://github.com/LearnWeb3DAO/Celo-Track/blob/main/NFT-Marketplace-Part-1.md).

### 3D Environment

As of August 2022, `socketio` is the branch with latest changes to the 3D environemnt. You will need to switch to `socketio` branch and run `npm run dev` in `/frontend` directory.

To see the NFT's in the 3D environment you will have to connect on the network through one of the wallet extensions (e.g. Metamask) on the homepage `http://localhost:3000/`

In your browser, navigate to - `http://localhost:3000/live`. In the top left corner you will see an input field where you can type a username. 

At this point you will enter the 3D environment and will be able to navigate your way around using the following keys:

Navigation: `W A S D`

Fast Movement: hold `SHIFT`

Jump: `Space`

If you are connected to the network with one of the wallet you should see three NFT images that are hosted on [IPFS](https://ipfs.tech/).

### Socket.io

*Work in progress*

`socketio` branch contains unfinished code that will allow multiple usrs to be able to see each other locations in real time using [Socket.io](https://socket.io/).

Although this feature is not working properly at the moment, you can 
- Take out the comment on line 60 in the `\frontend\components\threeD\user\User.jsx` file.
- Open the `http://localhost:3000/live` page in two different tabs
- In each tab, stand against the other tabs user's location. If you don't see the other user (white sphere), try moving around in both tabs.

# Credits

NFT marketplace part of the code is based on [this guide](https://github.com/LearnWeb3DAO/Celo-Track/blob/main/NFT-Marketplace-Part-1.md).
