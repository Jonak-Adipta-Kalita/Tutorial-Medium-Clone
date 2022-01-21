import Head from "next/head";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Posts from "../components/Posts";
import { sanityClient } from "../sanity";
import { Post } from "../typing";

interface Props {
  posts: Post[];
}

const Home = ({ posts }: Props) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>JAK Medium Clone</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <Banner />
      <Posts posts={posts} />
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const query: string = `*[_type == "post"]{
    _id,
    title,
    slug,
    author -> {
      name,
      image
    },
    description,
    mainImage
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts: posts,
    },
  };
};
