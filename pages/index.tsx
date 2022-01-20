import Head from "next/head";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Posts from "../components/Posts";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>JAK Medium Clone</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <Banner />
      <Posts />
    </div>
  );
};

export default Home;
