import { GetStaticProps } from "next";
import Head from "next/head";
import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { Comment, Post } from "../../typing";
import { useForm, SubmitHandler } from "react-hook-form";
import PortableText from "react-portable-text";
import { useState } from "react";

interface Props {
  post: Post;
}

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

const Slug = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        alert(err.message);
        setSubmitted(false);
      });
  };

  return (
    <main className="">
      <Head>
        <title>JAK Medium Clone - {post.title}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <img
        src={urlFor(post.mainImage).url()!}
        alt=""
        className="h-[220px] w-full object-cover cursor-zoom-in"
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            alt=""
            className="h-10 w-10 rounded-full"
          />
          <p className="font-extralight text-sm">
            Blog Post by{" "}
            <span className="text-green-600 hover:underline cursor-pointer">
              {post.author.name}
            </span>{" "}
            - Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thankyou for submitting your Comment!!
          </h3>
          <p className="">Once it has been aprooved it will appear below!!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this Blog?</h3>
          <h4 className="text-3xl font-bold">Leave a Comment below!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              type="text"
              placeholder="Your Name"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              type="email"
              placeholder="Your Email"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="Your Comment"
              rows={8}
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <p className="text-red-500"> - Name is Required!!</p>
            )}
            {errors.email && (
              <p className="text-red-500"> - Email is Required!!</p>
            )}
            {errors.comment && (
              <p className="text-red-500"> - Comment is Required!!</p>
            )}
          </div>
          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment: Comment) => (
          <div className="" key={comment._id}>
            <p className="">
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
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
        'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
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
    revalidate: 60,
  };
};
