import Head from "next/head";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Post_ from "../components/Post";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Post_ key={post._id} post={post} />
        ))}
      </div>
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
