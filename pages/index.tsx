import Head from "next/head";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="">
      <Head>
        <title>JAK Medium Clone</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
    </div>
  );
};

export default Home;
