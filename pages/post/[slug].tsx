import {useState} from 'react'
import { GetStaticProps } from 'next'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'

interface Props {
  post: Post
}

export default function post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [mail, setMail] = useState('')
  const [comment, setComment] = useState('')

  function submitComment(e:any){
    e.preventDefault()
    fetch('/api/createComment', {
      method: 'post',
      body: JSON.stringify({name, mail, comment, _id:post._id})
    }).then(data=>{
      console.log(data)
      setSubmitted(true)
    }).catch(err=>{
      console.log(err)
      setSubmitted(false)
    })
    setName('')
    setMail('')
    setComment('')
  }
  return (
    <main className="mx-auto max-w-7xl">
      <Header />
      <img
        src={urlFor(post.mainImage).url()}
        alt="post"
        className="h-40 w-full object-cover"
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt="author"
          />
          <p className="text-sm font-extralight">
            blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => {
                <h1 className="my-5 text-2xl font-bold" {...props}/>
              },
              h2: (props: any) => {
                <h1 className="my-5 text-xl font-bold" {...props}/>
              },
              li: ({ children }: any) => {
                <li className="ml-4 list-disc" >{children}</li>
              },
              link: ({ href, children }: any) => {
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              },
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500"/>

      {submitted?(
        <div className="flex flex-col my-10 p-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>
            Once it has been approve, it will appear below
          </p>
        </div>
      ):(
        <form onSubmit={submitComment} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave comment below</h4>
          <hr className="py-3 mt-2"/>

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input onChange={e=>setName(e.target.value)} placeholder="John Appleseed" type="text" className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none"/>
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input onChange={e=>setMail(e.target.value)} placeholder="John@Appleseed" type="email" className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none"/>
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea onChange={e=>setComment(e.target.value)} placeholder="comment" rows={8}  className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 focus:ring outline-none"/>
          </label>
          <input type="submit" value="submit" className="shadow bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-white py-2 px-4 rounded"/>
        </form>
      )}

      <div className="flex flex-col my-10 p-10 shadow-yellow-500 shadow space-y-2 mx-auto max-w-3xl">
        <h3 className="text-4xl">comments</h3>
        <hr className="pb-2"/>
        {post.comments.map(comment =>(
          <div key={comment._id}>
            <p><span className="text-yellow-500">{comment.name}: </span>{comment.comment}</p>
          </div>
        ))}
      </div>

    </main>
  )
}

export async function getStaticPaths() {
  const query = `
  *[_type=="post"]{
    _id,
    slug{current}
  }
  `
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
  *[_type=="post"&&slug.current==$slug][0]{
    _id,
    _createdAt,
    title,
    author->{
    name,
    image
  },
  'comments': 
  *[_type=="comment"&& post._ref==^._id&&approved==true],
  description,
  mainImage,
  slug,
  body
  }
  `
  const post = await sanityClient.fetch(query, { slug: params?.slug })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
