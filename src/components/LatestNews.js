import React from 'react'
import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import Image from '@theme/IdealImage'
import useBaseUrl from '@docusaurus/useBaseUrl'
import TagsListInline from '@theme/TagsListInline'

import TimeStamp from './TimeStamp'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function RecentBlogPostCard({ recentPost }) {
  const { blogData } = recentPost

  return (
    <Card className='flex w-full flex-col gap-0 py-0'>
      <Link to={blogData.metadata.permalink}>
        <Image
          className='block h-auto w-full rounded-t-lg object-cover'
          img={useBaseUrl(blogData.metadata.frontMatter.image)}
          alt={blogData.metadata.title}
          loading='lazy'
        />
      </Link>

      <CardContent className='p-6'>
        {blogData.metadata.tags.length > 0 && (
          <div className='blog-tags m-0 flex flex-wrap gap-2'>
            <TagsListInline tags={blogData.metadata.tags} />
          </div>
        )}

        <Link to={blogData.metadata.permalink} className='mt-4'>
          <p className='text-foreground mb-1 p-0 text-xl font-semibold'>
            {blogData.metadata.title}
          </p>
        </Link>

        <p className='mt-2 mb-4 line-clamp-2 dark:text-gray-400'>{blogData.metadata.description}</p>
        <div className='*:data-[slot=avatar]:ring-background flex items-center -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale'>
          {blogData.metadata.authors.map((author, index) => {
            const authorLink = author.page?.permalink || author.url || '#'
            return (
              <Link
                href={authorLink}
                title={author.name}
                key={index}
                className='transition-opacity hover:opacity-80'
              >
                <Avatar>
                  <Image
                    alt={author.name}
                    img={useBaseUrl(author.imageURL)}
                    className='aspect-square h-full w-full'
                  />
                </Avatar>
              </Link>
            )
          })}

          <div className='ml-4 text-sm dark:text-gray-400'>
            <span>
              <TimeStamp timestamp={blogData.metadata.date} />
            </span>
            <span className='mx-2'>•</span>
            <span>{Math.ceil(blogData.metadata.readingTime)} min read</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LatestNews({ homePageBlogMetadata, recentPosts }) {
  return (
    <div className='mx-auto my-16 max-w-7xl px-4'>
      <div className='mb-16 text-center'>
        <h2 className='mb-4 text-3xl font-bold'>
          <Translate id="homepage.latestNews.title" description="Latest news section title">最新消息</Translate>
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          <Translate id="homepage.latestNews.description" description="Latest news section description">OpenClaw 社群最新動態與教學文章</Translate>
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3'>
        {recentPosts.map((recentPost, index) => (
          <div key={index} className='flex'>
            <RecentBlogPostCard recentPost={recentPost} />
          </div>
        ))}
      </div>

      <div className='mt-8 text-center'>
        <Button asChild>
          <Link to={homePageBlogMetadata.path} className='hover:text-primary-foreground'>
            <Translate id="homepage.latestNews.viewAll" description="View all posts button">查看全部文章</Translate>
          </Link>
        </Button>
      </div>
    </div>
  )
}
