import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import Link from 'next/link';

const {BLOG_URL, CONTENT_API_KEY} = process.env

type Post = {
  title: string;
  slug: string;
};

const getPosts = async () => {
  console.log(BLOG_URL);
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt,reading_time`
  ).then((res) => res.json());
  console.log(res);
  const posts = res.posts
  return posts;
};

export const getStaticProps = async ({ params }) => {
  const posts = await getPosts();
  return {
    props: { posts },
  };
};

const Home: React.FC<{ posts: Post[] }> = (props) => {
  const { posts } = props;
  return (
    <div className={styles.container}>
      <h1>Welcome</h1>
      <ul>
        {posts.map((post, i) => (
          <li key={i}>
            <Link href='/post/[slug]' as={`/post/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
