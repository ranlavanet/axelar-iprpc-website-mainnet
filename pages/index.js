import Head from "next/head";
import MainPageComponent from "../components/mainPageComponent";
import Navbar from "../components/navbar";

const Home = () => {
  return (
    <>
      <Head>
        <title>Lava -Axelar ipRPC dapp</title>
        <meta
          name="description"
          content="decentralized application for reward distribution"
        />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <Navbar />
      <MainPageComponent />
    </>
  );
}

export default Home;