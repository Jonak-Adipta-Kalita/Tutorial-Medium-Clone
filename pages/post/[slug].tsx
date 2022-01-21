import { GetStaticProps } from "next";
import Head from "next/head";
import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { Post } from "../../typing";

interface Props {
  post: Post;
}

const Slug = ({ post }: Props) => {
  return (
    <main className="">
      <Head>
        <title>JAK Medium Clone - {post.title}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
    </main>
  );
};

export default Slug;

export const getStaticPaths = async () => {
  const query: string = `*[_type == "post"]{
    _id,
    slug {
     current,
    },
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query: string = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image
        },
        'comments': *[_type == "comment" && post.ref == ^._id && approved == true],
        description,
        mainImage,
        slug,
        body
    }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) return { notFound: true };

  return {
    props: {
      post: post,
    },
  };
};
