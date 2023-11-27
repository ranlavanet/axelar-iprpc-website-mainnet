import Head from "next/head";
import SendTxPageComponent from "../components/sendTxPageComponent.js";
import Navbar from "../components/navbarTxPage";

const Home = () => {
  return (
    <div className="page-container">
      <div className="header-container">
        <Navbar />
        <Head>
          <title>Lava - Axelar ipRPC dapp</title>
          <meta
            name="description"
            content="decentralized application for reward distribution"
          />
          <link rel="icon" href="/img/logo.png" />
        </Head>
      </div>
      <div className="send-tx-container">
        <div className="send-tx-content">
          <SendTxPageComponent />
        </div>
      </div>
      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .header-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .send-tx-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .send-tx-content {
          flex: 1;
          overflow-y: auto; /* Add this to allow scrolling if the content is too large */
        }
      `}</style>
    </div>
  );
}

export default Home;
