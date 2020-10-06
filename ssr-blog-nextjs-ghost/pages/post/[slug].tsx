import Link from 'next/link';
import { Router, useRouter } from 'next/router';
import styles from '../../styles/Home.module.scss';
const { BLOG_URL, CONTENT_API_KEY } = process.env;

const getPosts = async (slug: string) => {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html`
  ).then((res) => res.json());
  console.log(res);
  const posts = res.posts;
  return posts[0];
};

export const getStaticProps = async ({ params }) => {
  const post = await getPosts(params.slug);
  return {
    props: { post },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

type Post = {
  title: string;
  html: string;
  slug: string;
};

const Post: React.FC<{ post: Post }> = (props) => {
  console.log(props);
  const { post } = props;
  const [enableLoadComments, setEnableLoadComments]=useState<boolean>(true);

  const loadComments = () =>{

(window as any).disqus_config = function () {
this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = post.slug; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};

const script = document.createElement('script')
script.src = 'https://ghost-nextjs-blog.disqus.com/embed.js'
script.setAttribute('data-timestamp', Date.now().toString())
document.body.appendChild(script)

  }

  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className={styles.container}>
      <h1>{post.title}</h1>
      <Link href='/'>
        <a>
          {' '}
          <h3>Go back</h3>       </a>
      </Link>
          <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
          <p className={styles.goback} onClick={loadComments}>
            Load comments

          </p>
<div id="disqus_thread"></div>
    </div>
  );
};

export default Post;
